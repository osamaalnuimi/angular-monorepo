# TDR-0005: Loading and Error State Implementation

## Status

Implemented

## Summary

This document describes the implementation of loading and error states in the World Demographics Visualization application, ensuring a robust and user-friendly experience during data fetching and error scenarios.

## Problem

Modern web applications need to handle asynchronous data loading and potential errors gracefully. Specific challenges include:

1. Providing visual feedback during data loading to improve perceived performance
2. Handling various error scenarios (network issues, server errors, etc.)
3. Offering users a way to recover from errors
4. Maintaining a consistent user experience across the application
5. Ensuring the UI remains responsive during loading and error states

## Decision

We will implement a comprehensive loading and error state management system that:

1. Uses Angular signals for state management
2. Provides visual feedback during data loading with a spinner component
3. Shows meaningful error messages when issues occur
4. Includes a retry mechanism for error recovery
5. Handles empty data states gracefully

## Implementation Details

### State Management with Signals

```typescript
// In the facade
@Injectable({ providedIn: 'root' })
export class WorldDemographicsFacade {
  private dataVisualizationService = inject(DataVisualizationService);

  // Create a resource to manage loading, error, and data states
  datasetResource = createResource<CountryData[]>({ initialState: { loading: false, error: null, data: null } });

  loadWorldDemographics(): void {
    // Set loading state
    this.datasetResource.setLoading(true);

    this.dataVisualizationService.getWorldDemographics().subscribe({
      next: (data) => {
        this.datasetResource.setData(data);
        this.datasetResource.setLoading(false);
      },
      error: (err) => {
        console.error('Error loading world demographics:', err);
        this.datasetResource.setError(err.message || 'Failed to load world demographics data');
        this.datasetResource.setLoading(false);
      },
    });
  }
}
```

### Component Template with Loading and Error States

```html
@let data = dataset(); @if(isLoading()) {
<div class="loading-container">
  <div class="spinner"></div>
  <p>Loading world demographics data...</p>
</div>
} @else if(error()) {
<div class="error-container">
  <div class="error-icon">⚠️</div>
  <h3>Error Loading Data</h3>
  <p>{{ error() }}</p>
  <button (click)="reload()" class="retry-button">Retry</button>
</div>
} @else if(data) {
<visualizations-circle-packing [dataset]="data" [sizeBy]="sizeBy()" (countrySelected)="onCountrySelected($event)" (sizeByChanged)="onSizeByChanged($event)" />
} @else {
<div class="empty-state">
  <p>No data available</p>
</div>
}
```

### CSS Styling for States

```scss
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  color: #e74c3c;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2980b9;
}
```

### Error Recovery Implementation

```typescript
@Component({
  selector: 'visualizations-world-demographics',
  standalone: true,
  imports: [CommonModule, CirclePackingComponent],
  templateUrl: './world-demographics.component.html',
  styleUrls: ['./world-demographics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldDemographicsComponent {
  private facade = inject(WorldDemographicsFacade);

  // State signals
  dataset = this.facade.datasetResource.value;
  isLoading = this.facade.datasetResource.isLoading;
  error = this.facade.datasetResource.error;

  // Method to reload data when there's an error
  reload(): void {
    this.facade.loadWorldDemographics();
  }
}
```

## Alternatives Considered

### Traditional RxJS Approach

Using BehaviorSubjects and async pipes for state management would work but wouldn't provide the performance benefits and ergonomics of signals.

### Loading Libraries

Third-party loading libraries like ngx-spinner would provide more loading options but would add an extra dependency for functionality we can implement simply ourselves.

### Global Error Handling

A global error handling service could catch all errors but wouldn't provide the context-specific handling we want for different components.

## Trade-offs

### Advantages

- Clear visual feedback improves user experience during loading
- Explicit error states with retry options help users recover from failures
- Component-specific loading and error states provide contextual information
- Consistent styling creates a unified experience
- Minimal dependencies by using built-in Angular features

### Disadvantages

- Additional code complexity compared to simpler approaches
- Requires careful state management to avoid inconsistent states
- Custom implementation requires more testing than using established libraries
- Multiple loading indicators could be distracting if many components load simultaneously

## Dependencies

- Angular 17+ for @if syntax and signals
- CSS animations for the spinner effect
- Angular's change detection for updating state

## References

- [Angular Signals Documentation](https://angular.io/guide/signals)
- [UX Best Practices for Loading States](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/)
- [Error Handling Patterns](https://blog.angular-university.io/rxjs-error-handling/)
- [Loading State Design Patterns](https://www.lukew.com/ff/entry.asp?1797)
