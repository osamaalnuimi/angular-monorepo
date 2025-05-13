import * as d3 from 'd3';
import { CircleNode } from '@angular-monorepo/visualizations/domain';

/**
 * Creates a color scale for regions
 */
export function createColorScale(
  regions: string[]
): d3.ScaleOrdinal<string, string> {
  return d3.scaleOrdinal<string>().domain(regions).range(d3.schemeCategory10);
}

/**
 * Calculates fill color for a node based on its depth and parent
 */
export function calculateNodeFillColor(
  d: CircleNode,
  colorScale: d3.ScaleOrdinal<string, string>
): string {
  if (d.depth === 0) return 'white'; // Root
  if (d.depth === 1) return '#ccc'; // Continent
  if (d.depth === 2) return colorScale(d.data.name); // Region

  // Convert color object to string with proper null checking
  const parentColor = d.parent ? colorScale(d.parent.data.name) : '#ccc';
  const brighterColor = d3.color(parentColor)?.brighter(0.5);
  return brighterColor ? brighterColor.toString() : parentColor; // Country
}

/**
 * Calculates appropriate radius for a node based on its depth
 */
export function calculateNodeRadius(d: CircleNode): number {
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
}

/**
 * Determines appropriate text to display based on node size
 */
export function calculateNodeText(d: CircleNode): string {
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
}
