# TDR-0002: Circle Packing Layout Implementation

## Status

Implemented

## Summary

This document describes the technical implementation of the circle packing layout for visualizing hierarchical world demographics data, focusing on the horizontal arrangement of regions and dynamic sizing.

## Problem

Traditional circle packing layouts in D3.js tend to arrange circles vertically, which can lead to excessive scrolling on wide screens. We need to:

1. Optimize the layout for horizontal screens
2. Arrange regions horizontally with proper wrapping
3. Dynamically adjust the SVG dimensions based on data size
4. Ensure efficient use of screen real estate
5. Maintain the hierarchical relationship between continents, regions, and countries

## Decision

We will implement a custom circle packing layout that:

1. Removes the continent level from the visualization when a continent is selected
2. Arranges regions horizontally with wrapping behavior
3. Dynamically calculates the SVG height based on the selected continent's data
4. Sorts regions by size to improve packing efficiency
5. Uses a wider aspect ratio to better utilize horizontal space

## Implementation Details

### Data Transformation for Horizontal Layout

```typescript
private transformData(data: CountryData[]): HierarchicalNode {
  // Group countries by region
  const regionMap = new Map<string, CountryData[]>();

  data.forEach(country => {
    if (!regionMap.has(country.region)) {
      regionMap.set(country.region, []);
    }
    regionMap.get(country.region)!.push(country);
  });

  // Create root node
  const root: HierarchicalNode = {
    name: this.selectedContinent || 'World',
    children: []
  };

  // Add regions directly to root (skip continent level)
  Array.from(regionMap.entries()).forEach(([region, countries]) => {
    root.children.push({
      name: region,
      children: countries.map(country => ({
        name: country.name,
        value: country[this.sizeBy],
        data: country
      }))
    });
  });

  return root;
}
```

### Dynamic Height Calculation

```typescript
private setHeightBasedOnContinent(data: CountryData[]): void {
  // Count countries and regions
  const countryCount = data.length;
  const regionCount = new Set(data.map(c => c.region)).size;

  // Calculate appropriate height based on data size
  if (countryCount < 10) {
    this.height = 500; // Small dataset
  } else if (countryCount < 30) {
    this.height = 600; // Medium dataset
  } else {
    this.height = 700 + Math.floor(countryCount / 50) * 100; // Large dataset
  }

  // Adjust width-to-height ratio for horizontal layout
  this.width = Math.max(900, this.height * 1.5);

  // Further adjust based on region count for horizontal wrapping
  if (regionCount > 5) {
    this.width = Math.max(this.width, regionCount * 150);
  }
}
```

### Horizontal Region Arrangement

```typescript
private updateChart(): void {
  // Clear previous chart content
  this.svg.selectAll('*').remove();

  // Create hierarchical data structure
  const hierarchicalData = this.transformData(this.dataset);

  // Create D3 hierarchy
  const root = d3.hierarchy(hierarchicalData)
    .sum(d => (d as any).value || 0)
    .sort((a, b) => b.value! - a.value!); // Sort by size for better packing

  // Create circle packing layout with adjusted size for horizontal layout
  const pack = d3.pack()
    .size([this.width - 100, this.height - 100])
    .padding(3);

  // Apply layout
  const packedData = pack(root);

  // Render circles
  // ...
}
```

## Alternatives Considered

### Standard D3 Circle Packing

The standard D3 circle packing layout would create a more compact visualization but wouldn't optimize for horizontal screens and would require more vertical scrolling.

### Grid Layout

A simple grid layout for regions would be easier to implement but wouldn't maintain the size relationships between different regions and countries.

### Treemap Layout

A treemap would efficiently use screen space but wouldn't preserve the circular aesthetic and would be less effective at showing hierarchical relationships.

## Trade-offs

### Advantages

- Better utilization of wide screens
- Reduced vertical scrolling
- More intuitive layout for geographical data
- Improved visibility of smaller regions
- Dynamic sizing adapts to different datasets

### Disadvantages

- More complex implementation than standard D3 circle packing
- May not be as space-efficient for very large datasets
- Requires careful tuning of width and height parameters
- Custom layout may be less stable than built-in D3 layouts

## Dependencies

- D3.js v7.x hierarchy and pack modules
- Angular's change detection for updating the layout when data changes
- Browser support for SVG and modern CSS

## References

- [D3.js Hierarchy Documentation](https://github.com/d3/d3-hierarchy)
- [Circle Packing Layout](https://d3js.org/d3-hierarchy/pack)
- [Responsive D3 Visualizations](https://www.d3indepth.com/responsive/)
