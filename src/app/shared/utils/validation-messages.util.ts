import { AbstractControl, ValidationErrors } from '@angular/forms';

export function getValidationMessage( control: AbstractControl | null, label: string): string | null {
  if (!control || !control.invalid) return null;

  const errors: ValidationErrors | null = control.errors;
  if (!errors) return null;

  if (errors['required']) {
    return `Please enter a valid ${label.replace('_', ' ')}.`;
  }

  if (errors['minlength']) {
    const requiredLength = errors['minlength'].requiredLength;
    return `${label.replace('_', ' ').charAt(0).toUpperCase() + label.replace('_', ' ').slice(1)} must be at least ${requiredLength} characters long.`;
  }

  return null;
}