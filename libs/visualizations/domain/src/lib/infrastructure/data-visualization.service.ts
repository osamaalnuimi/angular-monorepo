import { Injectable, resource } from '@angular/core';
import { WorldData } from '../entities/data-visualization.interface';

@Injectable()
export class DataVisualizationService {
  loadDataset() {
    return resource({
      loader: async () => {
        const response = await fetch('/europe_population_enriched.json');
        if (!response.ok) {
          throw new Error('Failed to load dataset');
        }
        return (await response.json()) as WorldData;
      },
    });
  }
}
