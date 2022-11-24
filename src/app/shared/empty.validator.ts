import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emptyValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  // value not blank
  if (v && v != null && typeof v === 'string' && v.trim() === '') {
    return {
      empty: true
    };
  }
  return null;
}
