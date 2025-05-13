import {
  CircleNode,
  CountryData,
  Metric,
  WorldData,
} from '@angular-monorepo/visualizations/domain';
import {
  calculateHeightForContinent,
  calculateNodeFillColor,
  calculateNodeRadius,
  calculateNodeText,
  createColorScale,
  getAllRegions,
  transformDataToHierarchy,
} from '@angular-monorepo/visualizations/util-data-transformation';
import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { CirclePackingService } from './circle-packing.service';

// Node depth constants for better readability
const NodeDepth = {
  ROOT: 0,
  CONTINENT: 1,
  REGION: 2,
  COUNTRY: 3,
} as const;

// Tooltip offset constant
const TOOLTIP_OFFSET = 0;

@Component({
  selector: 'visualizations-circle-packing',
  imports: [DecimalPipe],
  templateUrl: './circle-packing.component.html',
  styleUrl: './circle-packing.component.css',
  providers: [CirclePackingService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePackingComponent implements AfterViewInit {
  dataset = input.required<WorldData>();
  sizeBy = input<Metric>('population');

  countrySelected = output<CountryData>();
  sizeByChanged = output<Metric>();

  private chartContainer = viewChild.required<ElementRef>('chartContainer');

  selectedCountry = signal<CountryData | null>(null);
  drawerOpen = signal<boolean>(false);

  // Add signals for continent selection and available continents
  availableContinents = signal<string[]>([]);
  selectedContinent = signal<string>('Europe');

  // Add signals for sidebar functionality
  continents = signal<string[]>([]);
  visibleContinents = signal<Set<string>>(new Set());
  visibleRegions = signal<Set<string>>(new Set());
  expandedContinents = signal<Set<string>>(new Set());

  // Define the svg property without initializing it with DOM operations
  private svg: d3.Selection<any, unknown, any, undefined> | undefined;
  private width = 0; // Will be set dynamically based on container size
  private height = 0; // Will be set dynamically based on content
  private margin = { top: 20, right: 20, bottom: 20, left: 20 };
  private innerWidth = 0;
  private innerHeight = 0;
  private chartInitialized = false;

  // Create an effect to update the chart when inputs change
  constructor(private circlePackingService: CirclePackingService) {
    effect(() => {
      // Access the signals to register dependencies
      const datasetValue = this.dataset();
      const sizeByValue = this.sizeBy();
      const selectedContinentValue = this.selectedContinent();

      // Only update if chart is already initialized
      if (this.chartInitialized && this.svg) {
        console.log('Updating chart due to signal change');
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.initializeContinentsAndRegions();
      this.initializeChart();
      this.chartInitialized = true;
      this.updateChart();
    });
  }

  // Initialize continents and regions from the dataset
  initializeContinentsAndRegions(): void {
    const dataset = this.dataset();
    if (!dataset) return;

    // Extract all continents from the dataset
    const continentsList = Object.keys(dataset);
    this.continents.set(continentsList);
    this.availableContinents.set(continentsList);

    // By default, make all continents and regions visible
    const allContinents = new Set(continentsList);
    this.visibleContinents.set(allContinents);

    const allRegions = new Set<string>();
    continentsList.forEach((continent) => {
      const regions = Object.keys(dataset[continent] || {});
      regions.forEach((region) => allRegions.add(region));
    });
    this.visibleRegions.set(allRegions);
  }

  // Get regions for a specific continent
  getRegionsForContinent(continent: string): string[] {
    const dataset = this.dataset();
    if (!dataset || !dataset[continent]) return [];

    return Object.keys(dataset[continent]);
  }

  // Check if a continent is visible
  isContinentVisible(continent: string): boolean {
    return this.visibleContinents().has(continent);
  }

  // Check if a region is visible
  isRegionVisible(region: string): boolean {
    return this.visibleRegions().has(region);
  }

  // Check if a continent is expanded
  isContinentExpanded(continent: string): boolean {
    return this.expandedContinents().has(continent);
  }

  // Toggle continent visibility
  toggleContinent(continent: string): void {
    const visibleContinents = new Set(this.visibleContinents());

    if (visibleContinents.has(continent)) {
      visibleContinents.delete(continent);
    } else {
      visibleContinents.add(continent);
    }

    this.visibleContinents.set(visibleContinents);
    this.updateChart();
  }

  // Toggle region visibility
  toggleRegion(region: string): void {
    const visibleRegions = new Set(this.visibleRegions());

    if (visibleRegions.has(region)) {
      visibleRegions.delete(region);
    } else {
      visibleRegions.add(region);
    }

    this.visibleRegions.set(visibleRegions);
    this.updateChart();
  }

  // Toggle continent expansion
  toggleExpandContinent(continent: string): void {
    const expandedContinents = new Set(this.expandedContinents());

    if (expandedContinents.has(continent)) {
      expandedContinents.delete(continent);
    } else {
      expandedContinents.add(continent);
    }

    this.expandedContinents.set(expandedContinents);
  }

  onSizeByChange(metric: 'population' | 'land_area_km2'): void {
    this.sizeByChanged.emit(metric);
  }

  onContinentChange(event: Event): void {
    const continent = (event.target as HTMLSelectElement).value;
    this.selectedContinent.set(continent);
    // Update chart will be triggered by the effect
  }

  openDrawer(country: CountryData): void {
    this.selectedCountry.set(country);
    this.drawerOpen.set(true);
    this.countrySelected.emit(country);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    // Delay clearing the country data until after the animation completes
    setTimeout(() => {
      if (!this.drawerOpen()) {
        this.selectedCountry.set(null);
      }
    }, 300); // Match this with the CSS transition duration
  }

  private initializeChart(): void {
    const containerElement = this.chartContainer().nativeElement;

    // Get the actual width of the container
    const containerWidth = containerElement.clientWidth;
    this.width = containerWidth || 900; // Use container width or fallback to 900

    // Set height based on selected continent
    this.setHeightBasedOnContinent();

    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    console.log(
      `Initializing chart with dimensions: ${this.width}x${this.height}`
    );

    // Clear any existing SVG elements first
    d3.select(containerElement).selectAll('svg').remove();

    // Create SVG element - IMPORTANT: Don't append 'g' here
    this.svg = d3
      .select(containerElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('display', 'block')
      .style('margin', '0 auto');
  }

  // Set height based on the selected continent
  private setHeightBasedOnContinent(): void {
    this.height = calculateHeightForContinent(
      this.selectedContinent(),
      this.dataset(),
      this.width
    );

    console.log(
      `Set height to ${this.height}px for continent ${this.selectedContinent()}`
    );
  }

  private updateChart(): void {
    if (!this.svg || !this.dataset()) {
      return;
    }

    // Clear previous chart content but keep the SVG element
    this.svg.selectAll('*').remove();

    // Set dimensions based on container size and continent
    this.setHeightBasedOnContinent();

    // Update SVG dimensions
    this.svg.attr('width', this.width).attr('height', this.height);

    // Set inner dimensions (accounting for margins)
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    // Transform data into hierarchical structure
    const hierarchicalData = transformDataToHierarchy(
      this.dataset(),
      this.selectedContinent(),
      this.sizeBy()
    );

    // Create hierarchy and pack layout using the service
    const root = this.circlePackingService.createHierarchy(hierarchicalData);

    // Create the pack layout with the inner dimensions
    const packLayout = this.circlePackingService.createPackLayout(
      this.innerWidth,
      this.innerHeight
    );

    // Generate the packed data
    const packedData = packLayout(root);

    // Check if we have valid data
    if (isNaN(packedData.r)) {
      console.error(
        'Invalid radius in packed data. Check if your data has valid values.'
      );
      return;
    }

    // Get all regions for color scale
    const regions = Object.keys(getAllRegions(this.dataset()));
    const colorScale = createColorScale(regions);

    // Create a centered container group
    const container = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.width / 2 - this.innerWidth / 2}, ${
          this.height / 2 - this.innerHeight / 2
        })`
      );

    // Create circles for each node
    const node = container
      .selectAll('g')
      .data(packedData.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', (d) =>
        d.depth === NodeDepth.COUNTRY ? 'pointer' : 'default'
      ) // Only use pointer for countries
      .on('click', (event, d) => this.handleNodeClick(d as CircleNode))
      .on('mouseover', (event, d) =>
        this.handleMouseOver(event, d as CircleNode)
      )
      .on('mouseout', () => this.handleMouseOut());

    // Add circle elements
    node
      .append('circle')
      .attr('r', (d) => calculateNodeRadius(d as CircleNode))
      .attr('fill', (d) => calculateNodeFillColor(d as CircleNode, colorScale))
      .attr('stroke', '#999')
      .attr('stroke-width', (d) => (d.depth === NodeDepth.CONTINENT ? 2 : 1))
      .style('pointer-events', 'all'); // Ensure circles capture events

    // Add text labels - only for countries (depth 3)
    node
      .append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .style('font-size', (d) => `${Math.min(d.r / 3, 14)}px`)
      .style('pointer-events', 'none') // Text shouldn't interfere with events
      .style('display', (d) =>
        d.depth === NodeDepth.COUNTRY ? 'block' : 'none'
      ) // Only show text for countries
      .text((d) => calculateNodeText(d as CircleNode));

    console.log('Chart updated with new data');
  }

  // Handle node click events
  private handleNodeClick(d: CircleNode): void {
    if (d.depth === NodeDepth.COUNTRY && d.data.country) {
      this.openDrawer(d.data.country);
    }
  }

  // Handle mouse over events
  private handleMouseOver(event: MouseEvent, d: CircleNode): void {
    // Only show tooltips for countries
    if (d.depth !== NodeDepth.COUNTRY || !this.svg) return;

    // Add hover effect using the service
    this.circlePackingService.addHoverEffect(
      d3.select(event.currentTarget as Element)
    );

    // Get the circle radius to position tooltip
    const radius = calculateNodeRadius(d as CircleNode);

    // Always position tooltip at a fixed position above the circle center
    // regardless of where the mouse is within the circle
    const tooltipY = d.y - radius - TOOLTIP_OFFSET;

    const tooltipText = `${d.data.name}: ${d.value?.toLocaleString() || ''}`;

    // Use the service to add tooltip with the circle's x coordinate (not the mouse x)
    this.circlePackingService.addTooltip(this.svg, d.x, tooltipY, tooltipText);
  }

  // Handle mouse out events
  private handleMouseOut(): void {
    if (this.svg) {
      // Remove hover effect using the service
      this.circlePackingService.removeHoverEffect(
        this.svg,
        '#999',
        NodeDepth.CONTINENT
      );

      // Remove tooltips using the service
      this.circlePackingService.removeTooltips(this.svg);
    }
  }
}
