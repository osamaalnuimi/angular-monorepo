import { inject, Injectable } from '@angular/core';
import { DataVisualizationService } from '../infrastructure/data-visualization.service';

@Injectable()
export class WorldDemographicsFacade {
  datasetResource = inject(DataVisualizationService).loadDataset();
}
