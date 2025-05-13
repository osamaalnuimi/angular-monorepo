// circle-packing.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { HierarchicalNode } from '@angular-monorepo/visualizations/domain';

// Define the CircleNode type for better type safety
export type CircleNode = d3.HierarchyNode<HierarchicalNode> & {
  x: number;
  y: number;
  r: number;
  depth: number;
  data: HierarchicalNode;
  parent: CircleNode | null;
  children?: CircleNode[];
};

@Injectable()
export class CirclePackingService {
  /**
   * Creates a D3 hierarchy from hierarchical data
   */
  createHierarchy(data: HierarchicalNode): d3.HierarchyNode<HierarchicalNode> {
    return d3
      .hierarchy<HierarchicalNode>(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  /**
   * Creates a circle packing layout
   */
  createPackLayout(
    width: number,
    height: number,
    padding = 20
  ): d3.PackLayout<HierarchicalNode> {
    return d3.pack<HierarchicalNode>().size([width, height]).padding(padding);
  }

  /**
   * Adds hover effect to a circle
   */
  addHoverEffect(
    element: d3.Selection<any, any, any, any>,
    highlightColor = '#ff6b6b',
    strokeWidth = 3,
    duration = 200
  ): void {
    element
      .select('circle')
      .transition()
      .duration(duration)
      .attr('stroke', highlightColor)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-opacity', 0.8);
  }

  /**
   * Removes hover effect from all circles
   */
  removeHoverEffect(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    defaultColor = '#999',
    continentDepth = 1,
    duration = 200
  ): void {
    // Target all circle elements directly instead of using the class
    svg
      .selectAll('circle')
      .transition()
      .duration(duration)
      .attr('stroke', defaultColor)
      .attr('stroke-width', (d: any) => (d.depth === continentDepth ? 2 : 1))
      .attr('stroke-opacity', 1);
  }

  /**
   * Adds tooltip to a D3 selection
   */
  addTooltip(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: number,
    y: number,
    text: string,
    width = 160
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    const tooltipWidth = Math.max(
      width,
      this.calculateTextWidth(svg, text) + 40
    );

    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', `translate(${x},${y})`);

    tooltip
      .append('rect')
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
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('fill', 'black')
      .attr('opacity', 0)
      .text(text)
      .transition()
      .duration(200)
      .attr('opacity', 1);

    return tooltip;
  }

  /**
   * Removes all tooltips from the SVG
   */
  removeTooltips(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>
  ): void {
    svg.selectAll('.tooltip').remove();
  }

  /**
   * Calculates the width of text for tooltip sizing
   */
  private calculateTextWidth(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    text: string
  ): number {
    const tempText = svg.append('text').attr('visibility', 'hidden').text(text);

    const width = tempText.node()?.getComputedTextLength() || 0;
    tempText.remove();

    return width;
  }
}
