import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * This function returns a ValidatorFn that checks if the control's value contains only whitespace characters.
 * If the value is null, undefined, or an empty string, it returns null (no error).
 * If the value contains only whitespace characters, it returns a validation error object with the key 'whitespace'.
 * Otherwise, it returns null (no error).
 * @returns - A ValidatorFn that checks for whitespace-only values.
 */
export function NoWhitespaceValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const isWhitespaceOnly = String(value).trim().length === 0;
    return isWhitespaceOnly ? { whitespace: true } : null;
  };
}