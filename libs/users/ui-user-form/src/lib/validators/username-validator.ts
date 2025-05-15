import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map, of, switchMap, timer } from 'rxjs';

/**
 * Async validator to check if a username already exists
 * @param validateFn Function that checks if username exists
 * @returns AsyncValidatorFn that returns null if username is unique, or { usernameExists: true } if it exists
 */
export function usernameExistsValidator(
  validateFn: (username: string) => Observable<boolean>
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;

    // Don't validate empty values to avoid unnecessary API calls
    if (!username || username.trim() === '') {
      return of(null);
    }

    // Debounce the validation to avoid too many API calls while typing
    return timer(300).pipe(
      switchMap(() => validateFn(username)),
      map((exists) => (exists ? { usernameExists: true } : null))
    );
  };
}
