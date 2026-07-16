import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NoWhitespaceValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    // Let Validators.required handle truly empty values.
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const isWhitespaceOnly = String(value).trim().length === 0;
    return isWhitespaceOnly ? { whitespace: true } : null;

  };
}