import {
  CountryData,
  DataVisualizationService,
  Metric,
  WorldDemographicsFacade,
} from '@angular-monorepo/visualizations/domain';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CirclePackingComponent } from '@angular-monorepo/visualizations/ui-circle-packging';
@Component({
  imports: [CirclePackingComponent],
  selector: 'visualizations-feature-world-demographics',
  templateUrl: './world-demographics.component.html',
  styleUrls: ['./world-demographics.component.css'],
  providers: [WorldDemographicsFacade, DataVisualizationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldDemographicsComponent {
  private worldDemographicsFacade = inject(WorldDemographicsFacade);

  sizeBy = signal<Metric>('population');
  selectedCountry = signal<CountryData | null>(null);

  dataset = this.worldDemographicsFacade.datasetResource.value;
  isLoading = this.worldDemographicsFacade.datasetResource.isLoading;
  error = this.worldDemographicsFacade.datasetResource.error;

  onSizeByChanged(metric: Metric): void {
    this.sizeBy.set(metric);
  }

  onCountrySelected(country: CountryData): void {
    this.selectedCountry.set(country);
    console.log('Country selected:', country);
  }
  reload(): void {
    this.worldDemographicsFacade.datasetResource.reload();
  }
}
