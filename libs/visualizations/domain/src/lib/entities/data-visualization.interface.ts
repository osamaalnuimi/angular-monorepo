export interface CountryData {
  country: string;
  population: number;
  wikipedia: string;
  flag: string;
  land_area_km2: number;
}

export interface RegionData {
  [region: string]: CountryData[];
}

export interface WorldData {
  [continent: string]: RegionData;
}

export interface HierarchicalNode {
  name: string;
  value?: number;
  children?: HierarchicalNode[];
  country?: CountryData;
}

// Instead of directly extending d3.HierarchyNode, define CircleNode as a type
// that includes all the properties we need
export type CircleNode = d3.HierarchyNode<HierarchicalNode> & {
  x: number;
  y: number;
  r: number;
  depth: number;
  data: HierarchicalNode;
  parent: CircleNode | null;
  children?: CircleNode[];
};
export type Metric = 'population' | 'land_area_km2';
