# ADR-0005: D3.js for Visualizations

## Status

Accepted

## Context

The World Demographics Visualization application requires interactive, data-driven visualizations to display hierarchical geographical data. We need a visualization solution that:

1. Supports complex hierarchical data visualization
2. Provides interactive features like zooming, panning, and selection
3. Offers fine-grained control over visual elements
4. Can be integrated with our Angular application
5. Performs well with large datasets
6. Supports responsive design principles

## Decision

We will use D3.js (Data-Driven Documents) as our primary visualization library for implementing the Circle Packing Visualization and other potential visualizations. Specifically:

1. We will use D3.js version 7.x
2. We will integrate D3.js with Angular using a component-based approach
3. We will leverage D3's hierarchical data visualization capabilities, particularly the circle packing layout
4. We will handle the DOM manipulation through D3 while letting Angular manage the component lifecycle

Example implementation pattern:

```typescript
@Component({
  selector: 'visualizations-circle-packing',
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.css'],
})
export class CirclePackingComponent implements OnInit, OnChanges {
  @Input() dataset: CountryData[] = [];
  @Input() sizeBy: 'population' | 'land_area_km2' = 'population';

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width = 900;
  private height = 700;

  ngOnInit() {
    this.createSvg();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.svg && (changes['dataset'] || changes['sizeBy'])) {
      this.updateChart();
    }
  }

  private createSvg() {
    this.svg = d3
      .select('#visualization-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
  }

  private updateChart() {
    // D3 code for circle packing visualization
    // ...
  }
}
```

## Consequences

### Positive

- D3.js provides powerful data visualization capabilities with fine-grained control
- Excellent support for hierarchical data visualizations like circle packing
- Rich ecosystem of examples and documentation
- High performance with large datasets through efficient DOM updates
- Flexibility to create custom visualizations beyond standard chart types
- Strong community support and active development

### Negative

- Steep learning curve for developers not familiar with D3.js
- Imperative programming model can clash with Angular's declarative approach
- Manual DOM manipulation requires careful integration with Angular's change detection
- Can be verbose for simple visualizations
- Requires more custom code compared to higher-level charting libraries

### Neutral

- Requires understanding of SVG and web graphics concepts
- May need additional work to ensure accessibility
- Developers need to manage the visualization lifecycle carefully

## Alternatives Considered

### Chart.js / NGX-Charts

Higher-level charting libraries like Chart.js or NGX-Charts would be easier to use but lack the flexibility and fine-grained control needed for our specific circle packing visualization.

### Angular Material Components

Angular Material provides some basic data visualization components but doesn't support the complex hierarchical visualizations we need.

### Custom SVG Manipulation

Building our own SVG manipulation code without D3.js would give us complete control but would require significantly more development effort and would likely result in reinventing much of what D3.js already provides.

### WebGL-based Libraries (Three.js, etc.)

WebGL-based visualization libraries would offer better performance for very large datasets but would be overkill for our needs and would introduce additional complexity.

## References

- [D3.js Official Documentation](https://d3js.org/)
- [Circle Packing Example](https://observablehq.com/@d3/zoomable-circle-packing)
- [Integrating D3.js with Angular](https://blog.angular-university.io/angular-d3js/)
- [D3.js Data Visualization Fundamentals](https://www.d3indepth.com/)
