import {
  WorldData,
  CountryData,
  HierarchicalNode,
  Metric,
} from '@angular-monorepo/visualizations/domain';

/**
 * Transforms raw data into hierarchical structure for D3 visualization
 */
export function transformDataToHierarchy(
  dataset: WorldData,
  selectedContinent: string | null,
  sizeBy: Metric
): HierarchicalNode {
  const hierarchicalData: HierarchicalNode = {
    name: 'World',
    children: [],
  };

  // Process only the selected continent
  if (
    selectedContinent &&
    selectedContinent !== 'all' &&
    dataset[selectedContinent]
  ) {
    // Create a wrapper node for the continent
    const continentNode: HierarchicalNode = {
      name: selectedContinent,
      children: [],
    };

    // Get all regions for the selected continent
    const regions = dataset[selectedContinent];

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
          sizeBy === 'population' ? country.population : country.land_area_km2;

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

    Object.entries(dataset).forEach(([continent, regions]) => {
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
            sizeBy === 'population'
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

  return hierarchicalData;
}

/**
 * Gets all regions from the dataset
 */
export function getAllRegions(dataset: WorldData): {
  [region: string]: boolean;
} {
  const regions: { [region: string]: boolean } = {};

  Object.values(dataset).forEach((continentData) => {
    Object.keys(continentData).forEach((region) => {
      regions[region] = true;
    });
  });

  return regions;
}

/**
 * Gets regions for a specific continent
 */
export function getRegionsForContinent(
  dataset: WorldData,
  continent: string
): string[] {
  if (!dataset || !dataset[continent]) return [];
  return Object.keys(dataset[continent]);
}

/**
 * Calculates appropriate height based on continent and data
 */
export function calculateHeightForContinent(
  selectedContinent: string,
  dataset: WorldData,
  width: number
): number {
  if (!dataset) {
    return 600; // Default height
  }

  // Count total countries in the selected continent
  let countryCount = 0;
  if (dataset[selectedContinent]) {
    Object.values(dataset[selectedContinent]).forEach(
      (countries: CountryData[]) => {
        countryCount += countries.length;
      }
    );
  }

  // Standard height calculation
  if (countryCount < 10) {
    return 500; // Small dataset
  } else if (countryCount < 30) {
    return 600; // Medium dataset
  } else if (countryCount < 50) {
    return 650; // Large dataset
  } else {
    return 700; // Very large dataset
  }
}
