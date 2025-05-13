# TDR-0003: Responsive Visualization Design

## Status

Implemented

## Summary

This document describes our approach to making the Circle Packing Visualization responsive across different screen sizes and devices, ensuring optimal user experience regardless of viewport dimensions.

## Problem

Data visualizations often struggle with responsiveness due to their complex nature and precise layout requirements. Specific challenges include:

1. SVG visualizations have fixed dimensions by default
2. Circle packing layouts need to maintain proportions while adapting to available space
3. Text labels can become unreadable on smaller screens
4. Interactive elements need to work on both desktop and touch devices
5. Performance can degrade on mobile devices with large datasets
6. Different aspect ratios require different layout optimizations

## Decision

We will implement a responsive design approach for our visualizations that:

1. Uses a container-based sizing strategy rather than fixed dimensions
2. Dynamically adjusts SVG dimensions based on container size
3. Implements different layout strategies based on screen width
4. Optimizes touch interactions for mobile devices
5. Adjusts text and visual elements based on available space
6. Uses CSS media queries in combination with JavaScript-based resizing

## Implementation Details

### Container-Based Sizing

```typescript
// HTML Template
<div class="visualization-container" #container>
  <div id="circle-packing-container"></div>
</div>
```

```css
.visualization-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}

#circle-packing-container {
  width: 100%;
  height: 100%;
}
```

### Dynamic SVG Resizing

```typescript
@ViewChild('container', { static: true }) container!: ElementRef;
private resizeObserver!: ResizeObserver;

ngAfterViewInit() {
  this.resizeObserver = new ResizeObserver(() => {
    this.updateDimensions();
    if (this.svg) {
      this.updateChart();
    }
  });

  this.resizeObserver.observe(this.container.nativeElement);
}

ngOnDestroy() {
  if (this.resizeObserver) {
    this.resizeObserver.disconnect();
  }
}

private updateDimensions() {
  const containerRect = this.container.nativeElement.getBoundingClientRect();
  this.width = containerRect.width;

  // Adjust height based on width and data size
  const aspectRatio = this.isSmallScreen() ? 1 : 1.5;
  this.height = Math.min(containerRect.height, this.width / aspectRatio);

  // Update SVG dimensions
  if (this.svg) {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
  }
}

private isSmallScreen(): boolean {
  return window.innerWidth < 768;
}
```

### Responsive Layout Strategies

```typescript
private updateChart() {
  // Clear previous chart content
  this.svg.selectAll('*').remove();

  // Adjust padding and spacing based on screen size
  const padding = this.isSmallScreen() ? 1 : 3;
  const labelSize = this.isSmallScreen() ? '8px' : '10px';

  // Create circle packing layout with adjusted parameters
  const pack = d3.pack()
    .size([this.width - 20, this.height - 20])
    .padding(padding);

  // Apply layout and render
  // ...

  // Adjust text labels
  this.svg.selectAll('.node-label')
    .style('font-size', labelSize)
    .style('display', d => {
      // Hide labels for small circles on small screens
      return this.isSmallScreen() && d.r < 15 ? 'none' : 'block';
    });
}
```

### Touch Interaction Optimization

```typescript
private setupEventHandlers(nodes: d3.Selection<SVGCircleElement, CircleNode, SVGGElement, unknown>) {
  nodes
    .on('click touchend', (event, d) => {
      event.stopPropagation();
      if (d.data.type === 'country') {
        this.countrySelected.emit(d.data);
      }
    })
    .on('mouseover touchstart', (event, d) => {
      this.showTooltip(event, d);
    })
    .on('mouseout touchend', () => {
      this.hideTooltip();
    });
}

private showTooltip(event: any, d: CircleNode) {
  // Adjust tooltip position based on device type
  const isTouchDevice = 'ontouchstart' in window;
  const xOffset = isTouchDevice ? 0 : 10;
  const yOffset = isTouchDevice ? -50 : 10;

  // Position and show tooltip
  // ...
}
```

## Alternatives Considered

### Fixed Breakpoints with Multiple Layouts

Creating entirely different visualizations for different breakpoints would provide more optimized experiences but would significantly increase development and maintenance effort.

### SVG Viewbox Only

Using only SVG viewBox for responsiveness would be simpler but wouldn't allow for different layout strategies based on screen size.

### Canvas-Based Rendering

Using Canvas instead of SVG would potentially offer better performance on mobile devices but would complicate the implementation of interactive features and accessibility.

## Trade-offs

### Advantages

- Visualization adapts to any screen size and device
- Better user experience across desktop, tablet, and mobile
- Efficient use of available screen space
- Improved readability on small screens through adaptive text sizing
- Smooth interactions on both mouse and touch devices

### Disadvantages

- More complex implementation than fixed-size visualizations
- Performance overhead from resize calculations
- Some visual compromises on very small screens
- Additional testing required across different devices and orientations
- Potential layout shifts during window resizing

## Dependencies

- ResizeObserver API (with potential polyfill for older browsers)
- D3.js for visualization rendering
- CSS media queries for style adjustments
- Angular's change detection for updating on resize

## References

- [Responsive SVG Techniques](https://css-tricks.com/responsive-d3-js-visualizations-with-svg/)
- [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [D3.js and Responsive Design](https://brendansudol.com/writing/responsive-d3)
- [Touch Events in D3](https://observablehq.com/@d3/multi-touch)
