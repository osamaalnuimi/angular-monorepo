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
import {
  WorldData,
  CountryData,
  Metric,
  HierarchicalNode,
  CircleNode,
} from '@angular-monorepo/visualizations/domain';
@Component({
  selector: 'visualizations-circle-packing',
  imports: [DecimalPipe],
  templateUrl: './circle-packing.component.html',
  styleUrl: './circle-packing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePackingComponent implements AfterViewInit {
  readonly dataset = input.required<WorldData>();
  readonly sizeBy = input<Metric>('population');

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
  constructor() {
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

    // Create SVG element
    this.svg = d3
      .select(containerElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        `translate(${this.margin.left + this.innerWidth / 2},${
          this.margin.top + this.innerHeight / 2
        })`
      );
  }

  // Set height based on the selected continent
  private setHeightBasedOnContinent(): void {
    const selectedContinentValue = this.selectedContinent();
    const dataset = this.dataset();

    if (!dataset) {
      this.height = 600; // Default height
      return;
    }

    // Count total countries in the selected continent
    let countryCount = 0;
    if (dataset[selectedContinentValue]) {
      // Count countries in the selected continent
      Object.values(dataset[selectedContinentValue]).forEach((countries) => {
        countryCount += countries.length;
      });
    }

    // Count regions in the selected continent
    let regionCount = 0;
    if (dataset[selectedContinentValue]) {
      regionCount = Object.keys(dataset[selectedContinentValue]).length;
    }

    // Use a wider aspect ratio (more width, less height)
    // Set height based on country count but consider region count for width
    if (countryCount < 10) {
      this.height = 500; // Small dataset
    } else if (countryCount < 30) {
      this.height = 600; // Medium dataset
    } else if (countryCount < 50) {
      this.height = 650; // Large dataset
    } else {
      this.height = 700; // Very large dataset
    }

    console.log(
      `Set height to ${this.height}px for ${countryCount} countries and ${regionCount} regions`
    );
  }

  private updateChart(): void {
    if (!this.svg) {
      console.error('SVG not initialized');
      return;
    }

    if (!this.dataset()) {
      console.error('Dataset is empty or undefined');
      return;
    }

    console.log('Dataset available:', Object.keys(this.dataset()));

    // Update height based on selected continent
    this.setHeightBasedOnContinent();

    // Get the container width again to ensure we have the latest size
    const containerElement = this.chartContainer().nativeElement;
    const containerWidth = containerElement.clientWidth;
    this.width = containerWidth || 900;

    // Update SVG dimensions
    d3.select(containerElement)
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Recalculate inner dimensions
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    // Clear previous chart content but keep the SVG element
    this.svg.selectAll('*').remove();

    // Transform data into hierarchical structure
    const hierarchicalData = this.transformData();
    console.log(
      'Hierarchical data children count:',
      hierarchicalData.children?.length || 0
    );

    // Create a circle packing layout with a wider aspect ratio
    const packLayout = d3
      .pack<HierarchicalNode>()
      .size([this.innerWidth, this.innerHeight])
      .padding(20);

    // Generate the pack data
    const root = d3
      .hierarchy<HierarchicalNode>(hierarchicalData)
      .sum((d) => d.value || 0);

    // Apply the pack layout
    const packedData = packLayout(root) as CircleNode;
    console.log(
      'Packed data descendants count:',
      packedData.descendants().length
    );

    // Check if we have valid data
    if (isNaN(packedData.r)) {
      console.error(
        'Invalid radius in packed data. Check if your data has valid values.'
      );
      return;
    }

    // Generate color scale for regions
    const regions = Object.keys(this.getAllRegions());
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(regions)
      .range(d3.schemeCategory10);

    // Skip drawing continents (depth 1) since we're already filtering by continent
    // Only draw regions (depth 2) and countries (depth 3)

    // Draw regions (depth 2)
    this.drawCircleGroup(
      packedData.descendants().filter((d) => d.depth === 2) as CircleNode[],
      colorScale
    );

    // Draw countries (depth 3)
    this.drawCircleGroup(
      packedData.descendants().filter((d) => d.depth === 3) as CircleNode[],
      colorScale
    );

    console.log('Chart update completed');
  }

  private drawCircleGroup(
    nodes: CircleNode[],
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    if (!nodes || nodes.length === 0) return;

    // Sort nodes by radius (largest first for rendering, but smallest on top for interaction)
    nodes.sort((a, b) => b.r - a.r);

    // Create a group for each node
    const nodeGroups = this.svg
      ?.selectAll(`g.node-depth-${nodes[0].depth}`)
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', `node node-depth-${nodes[0].depth}`)
      .attr(
        'transform',
        (d) =>
          `translate(${d.x - this.innerWidth / 2},${
            d.y - this.innerHeight / 2
          })`
      );

    // Add circles
    nodeGroups
      ?.append('circle')
      .attr('r', (d) => {
        // Scale circles based on depth to ensure better visibility
        if (d.depth === 1) {
          // Continents - keep original size
          return d.r;
        } else if (d.depth === 2) {
          // Regions - ensure minimum size
          return Math.max(d.r, 20);
        } else if (d.depth === 3) {
          // Countries - ensure minimum size for visibility
          return Math.max(d.r, 8);
        }
        return d.r;
      })
      .attr('fill', (d) => {
        if (d.depth === 0) return 'white'; // Root
        if (d.depth === 1) return '#ccc'; // Continent
        if (d.depth === 2) return colorScale(d.data.name); // Region
        // Convert color object to string with proper null checking
        const parentColor = d.parent ? colorScale(d.parent.data.name) : '#ccc';
        const brighterColor = d3.color(parentColor)?.brighter(0.5);
        return brighterColor ? brighterColor.toString() : parentColor; // Country
      })
      .attr('stroke', (d) => (d.depth === 3 ? 'black' : 'none'))
      .attr('stroke-width', 1)
      .attr('opacity', (d) => {
        if (d.depth === 0) return 0;
        if (d.depth === 3) return 0.9; // Make countries more visible
        return 0.8;
      })
      .style('cursor', (d) => (d.depth === 3 ? 'pointer' : 'default'))
      .on('click', (event: MouseEvent, d) => {
        if (d.depth === 3 && d.data.country) {
          this.openDrawer(d.data.country);
        }
      });

    // Add text labels for countries
    if (nodes[0].depth === 3) {
      nodeGroups
        ?.append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', (d) => {
          // Adjust font size based on circle radius, but ensure minimum readability
          const calculatedSize = Math.min(d.r / 3, 10);
          return Math.max(calculatedSize, 8) + 'px';
        })
        .style('fill', 'white')
        .style('pointer-events', 'none') // Prevent text from interfering with clicks
        .style('text-shadow', '0px 0px 2px rgba(0,0,0,0.7)') // Add text shadow for better visibility
        .text((d) => {
          // Always try to show at least some text
          if (d.r < 10) {
            // For very small circles, show first letter only
            return d.data.name.charAt(0);
          }

          // For medium circles, show abbreviated text
          if (d.r < 20) {
            const words = d.data.name.split(' ');
            if (words.length > 1) {
              return words.map((w) => w[0]).join('');
            }
            return d.data.name.substring(0, 3);
          }

          // For larger circles, show full or truncated name
          return d.data.name.length > d.r / 3
            ? d.data.name.substring(0, Math.floor(d.r / 3)) + '...'
            : d.data.name;
        });
    }

    // Add hover effects
    this.addHoverEffects(
      nodeGroups as d3.Selection<SVGGElement, CircleNode, SVGGElement, unknown>
    );
  }

  private addHoverEffects(
    nodeGroups: d3.Selection<SVGGElement, CircleNode, SVGGElement, unknown>
  ): void {
    const depth = nodeGroups.data()[0]?.depth;
    if (depth === undefined) return;

    if (depth === 1) {
      // Continents
      nodeGroups
        ?.on('mouseover', (event: MouseEvent, d) => {
          // Highlight the continent
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9);

          // Show title with animation
          const tooltip = this.svg
            ?.append('g')
            .attr('class', 'tooltip continent-tooltip')
            .attr(
              'transform',
              `translate(${d.x - this.innerWidth / 2},${
                d.y - this.innerHeight / 2 - d.r
              })`
            );

          // Calculate text width to determine tooltip width
          const tempText = this.svg
            ?.append('text')
            .attr('visibility', 'hidden')
            .text(d.data.name);

          const textLength = tempText?.node()?.getComputedTextLength() || 0;
          tempText?.remove();

          // Ensure minimum width of 160px or text width + padding
          const tooltipWidth = Math.max(160, textLength + 40);

          tooltip
            ?.append('rect')
            .attr('x', -tooltipWidth / 2)
            .attr('y', -25)
            .attr('width', tooltipWidth)
            .attr('height', 30)
            .attr('rx', 5)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0)
            .transition()
            .duration(200)
            .attr('opacity', 0.9);

          tooltip
            ?.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-10')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('opacity', 0)
            .text(d.data.name)
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', (event: MouseEvent) => {
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'none')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);

          // Remove tooltip with animation
          this.svg
            ?.selectAll('.continent-tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        });
    } else if (depth === 2) {
      // Regions
      nodeGroups
        .on('mouseover', (event: MouseEvent, d) => {
          // Highlight the region
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9);

          // Show title with animation
          const tooltip = this.svg
            ?.append('g')
            .attr('class', 'tooltip region-tooltip')
            .attr(
              'transform',
              `translate(${d.x - this.innerWidth / 2},${
                d.y - this.innerHeight / 2 - d.r - 20
              })`
            );

          // Calculate text width to determine tooltip width
          const tempText = this.svg
            ?.append('text')
            .attr('visibility', 'hidden')
            .text(d.data.name);

          const textLength = tempText?.node()?.getComputedTextLength() || 0;
          tempText?.remove();

          // Ensure minimum width of 160px or text width + padding
          const tooltipWidth = Math.max(160, textLength + 40);

          tooltip
            ?.append('rect')
            .attr('x', -tooltipWidth / 2)
            .attr('y', -25)
            .attr('width', tooltipWidth)
            .attr('height', 30)
            .attr('rx', 5)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0)
            .transition()
            .duration(200)
            .attr('opacity', 0.9);

          tooltip
            ?.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-10')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('opacity', 0)
            .text(d.data.name)
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', (event: MouseEvent) => {
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'none')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);

          // Remove tooltip with animation
          this.svg
            ?.selectAll('.region-tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        });
    } else if (depth === 3) {
      // Countries
      nodeGroups
        .on('mouseover', (event: MouseEvent, d) => {
          // Highlight the country
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('opacity', 1);

          // Show tooltip with animation
          const tooltip = this.svg
            ?.append('g')
            .attr('class', 'tooltip country-tooltip')
            .attr(
              'transform',
              `translate(${d.x - this.innerWidth / 2},${
                d.y - this.innerHeight / 2 - d.r - 20
              })`
            );

          // Calculate text width to determine tooltip width
          const tempText = this.svg
            ?.append('text')
            .attr('visibility', 'hidden')
            .text(d.data.country?.country || d.data.name);

          const textLength = tempText?.node()?.getComputedTextLength() || 0;
          tempText?.remove();

          // Ensure minimum width of 160px or text width + padding
          const tooltipWidth = Math.max(160, textLength + 40);

          tooltip
            ?.append('rect')
            .attr('x', -tooltipWidth / 2)
            .attr('y', -25)
            .attr('width', tooltipWidth)
            .attr('height', 30)
            .attr('rx', 5)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0)
            .transition()
            .duration(200)
            .attr('opacity', 0.9);

          tooltip
            ?.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-10')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('opacity', 0)
            .text(d.data.country?.country || d.data.name)
            .transition()
            .duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', (event: MouseEvent) => {
          d3.select(event.currentTarget as any)
            .select('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('opacity', 0.9);

          // Remove tooltip with animation
          this.svg
            ?.selectAll('.country-tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();
        });
    }
  }

  private transformData(): HierarchicalNode {
    const sizeMetric = this.sizeBy();
    const selectedContinentValue = this.selectedContinent();

    console.log('Size metric:', sizeMetric);
    console.log('Selected continent:', selectedContinentValue);

    // Create hierarchical structure optimized for horizontal layout
    const hierarchicalData: HierarchicalNode = {
      name: 'World',
      children: [],
    };

    // Process only the selected continent
    if (
      selectedContinentValue !== 'all' &&
      this.dataset()[selectedContinentValue]
    ) {
      // Create a wrapper node for the continent to help with horizontal layout
      const continentNode: HierarchicalNode = {
        name: selectedContinentValue,
        children: [],
      };

      // Get all regions for the selected continent
      const regions = this.dataset()[selectedContinentValue];

      // Create an array to hold region nodes
      const regionNodes: HierarchicalNode[] = [];

      // Process each region
      Object.entries(regions).forEach(([region, countries]) => {
        const regionNode: HierarchicalNode = {
          name: region,
          children: [],
        };

        // Add countries to the region
        countries.forEach((country) => {
          // Ensure country has valid data for the selected metric
          const value =
            sizeMetric === 'population'
              ? country.population
              : country.land_area_km2;

          if (value && value > 0) {
            regionNode.children = regionNode.children || [];
            regionNode.children.push({
              name: country.country,
              value: value,
              country: country,
            });
          }
        });

        // Only add region if it has countries
        if (regionNode.children && regionNode.children.length > 0) {
          regionNodes.push(regionNode);
        }
      });

      // Sort regions by size (total value) to help with packing
      regionNodes.sort((a, b) => {
        const aValue =
          a.children?.reduce((sum, c) => sum + (c.value || 0), 0) || 0;
        const bValue =
          b.children?.reduce((sum, c) => sum + (c.value || 0), 0) || 0;
        return bValue - aValue; // Descending order
      });

      // Add sorted regions to the continent node
      continentNode.children = regionNodes;

      // Add the continent node to the root
      hierarchicalData.children = [continentNode];
    } else {
      // If "all" is selected, create a flatter structure
      // Group regions by continent for better organization
      const continentNodes: { [key: string]: HierarchicalNode } = {};

      Object.entries(this.dataset()).forEach(([continent, regions]) => {
        // Create a node for each continent
        continentNodes[continent] = {
          name: continent,
          children: [],
        };

        // Add regions to their respective continent
        Object.entries(regions).forEach(([region, countries]) => {
          const regionNode: HierarchicalNode = {
            name: region,
            children: [],
          };

          // Add countries
          countries.forEach((country) => {
            // Ensure country has valid data for the selected metric
            const value =
              sizeMetric === 'population'
                ? country.population
                : country.land_area_km2;

            if (value && value > 0) {
              regionNode.children = regionNode.children || [];
              regionNode.children.push({
                name: country.country,
                value: value,
                country: country,
              });
            }
          });

          // Only add region if it has countries
          if (regionNode.children && regionNode.children.length > 0) {
            continentNodes[continent].children?.push(regionNode);
          }
        });
      });

      // Add non-empty continents to the root
      Object.values(continentNodes).forEach((continentNode) => {
        if (continentNode.children && continentNode.children.length > 0) {
          hierarchicalData.children?.push(continentNode);
        }
      });
    }

    console.log(
      'Hierarchical data structure created with',
      hierarchicalData.children?.length || 0,
      'continents'
    );

    return hierarchicalData;
  }

  private getAllRegions(): { [region: string]: boolean } {
    const regions: { [region: string]: boolean } = {};

    Object.values(this.dataset()).forEach((continentData) => {
      Object.keys(continentData).forEach((region) => {
        regions[region] = true;
      });
    });

    return regions;
  }
}
