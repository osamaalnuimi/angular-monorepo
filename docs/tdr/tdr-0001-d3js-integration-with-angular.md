# TDR-0001: D3.js Integration with Angular

## Status

Implemented

## Summary

This document describes the approach for integrating D3.js with Angular to create the Circle Packing Visualization component.

## Problem

D3.js is a powerful library for creating data visualizations, but it has a different paradigm than Angular's component-based architecture. D3 directly manipulates the DOM, while Angular prefers template-based rendering and has its own change detection system. We need to integrate these two approaches effectively to create interactive visualizations while maintaining Angular's benefits.

## Decision

We will use a hybrid approach where:

1. Angular manages the component lifecycle and provides the container for the visualization
2. D3.js handles the data-driven DOM manipulation within that container
3. Angular's change detection is used to trigger D3 updates when inputs change
4. D3 events are mapped to Angular outputs for component communication

## Implementation Details

### Component Structure

```typescript
@Component({
  selector: 'visualizations-circle-packing',
  standalone: true,
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePackingComponent implements OnInit, OnChanges {
  @Input() dataset: CountryData[] = [];
  @Input() sizeBy: 'population' | 'land_area_km2' = 'population';
  @Output() countrySelected = new EventEmitter<CountryData>();

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  ngOnInit() {
    this.createSvg();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.svg && (changes['dataset'] || changes['sizeBy'])) {
      this.updateChart();
    }
  }

  private createSvg() {
    // D3 code to create SVG container
  }

  private updateChart() {
    // D3 code to update visualization
  }
}
```

### D3 Integration Pattern

1. **Initialization**: Create the SVG and base elements in `ngOnInit`
2. **Updates**: Respond to input changes in `ngOnChanges` by calling D3 update methods
3. **Event Handling**: Map D3 events to Angular outputs

```typescript
private setupEventHandlers(nodes: d3.Selection<SVGCircleElement, CircleNode, SVGGElement, unknown>) {
  nodes
    .on('click', (event, d) => {
      if (d.data.type === 'country') {
        this.countrySelected.emit(d.data);
      }
    });
}
```

### Data Transformation

We transform the hierarchical data to a format D3's circle packing layout can use:

```typescript
private transformData(): HierarchicalNode {
  // Transform flat data to hierarchical structure for D3
  const root = {
    name: 'World',
    children: []
  };

  // Group by continent/region and build hierarchy
  // ...

  return root;
}
```

## Alternatives Considered

### Pure Angular Approach

Using only Angular's template system and CSS for visualizations would provide better integration with Angular but would lack D3's powerful layout algorithms and transitions.

### NgRx for State Management

Using NgRx to manage visualization state was considered but deemed too complex for this use case. Angular signals provide sufficient reactivity with less boilerplate.

### Web Components

Creating a standalone web component for visualizations would provide better encapsulation but would complicate the integration with Angular's input/output system.

## Trade-offs

### Advantages

- Leverages D3's powerful visualization capabilities
- Maintains Angular's component model and change detection
- Provides clear separation between application logic and visualization
- Enables complex interactive visualizations with minimal code

### Disadvantages

- Requires understanding of both D3 and Angular paradigms
- D3's imperative DOM manipulation can conflict with Angular's declarative approach
- Performance considerations when dealing with large datasets and frequent updates
- Debugging can be challenging when issues span both libraries

## Dependencies

- D3.js v7.x
- Angular 17+
- TypeScript 5.x

## References

- [D3.js Documentation](https://d3js.org/)
- [Angular Integration with D3](https://blog.angular-university.io/angular-d3js/)
- [Circle Packing Example](https://observablehq.com/@d3/zoomable-circle-packing)
- [D3 in Depth - Layouts](https://www.d3indepth.com/layouts/)
