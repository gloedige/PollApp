import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * This function retrieves the validation error message for a given form control. It checks if the control is invalid and has been touched or submitted, 
 * and returns an appropriate error message based on the validation errors present.
 * @param control The form control for which to retrieve the validation message.
 * @param label The label of the form control, used in the error message.
 * @returns A string containing the validation error message, or null if there are no errors. 
 */
export function getValidationMessage( control: AbstractControl | null, label: string): string | null {
  if (!control || !control.invalid) return null;

  const errors: ValidationErrors | null = control.errors;
  if (!errors) return null;

  if (errors['required'] || errors['pattern']) {
    return `Please enter a valid ${label.replace('_', ' ')}.`;
  }

  if (errors['minlength']) {
    const requiredLength = errors['minlength'].requiredLength;
    return `${label.replace('_', ' ').charAt(0).toUpperCase() + label.replace('_', ' ').slice(1)} must be at least ${requiredLength} characters long.`;
  }

  if (errors['maxlength']) {
    const requiredLength = errors['maxlength'].requiredLength;
    return `${label.replace('_', ' ').charAt(0).toUpperCase() + label.replace('_', ' ').slice(1)} cannot exceed ${requiredLength} characters.`;
  }

  return null;
}