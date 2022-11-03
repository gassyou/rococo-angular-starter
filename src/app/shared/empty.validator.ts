import { AbstractControl } from '@angular/forms';

export function emptyValidator(control: AbstractControl): { [key: string]: any } | null {
  const v = control.value;
  // value not blank
  if (v && v != null && typeof v === 'string' && v.trim() === '') {
    return {
      empty: true
    };
  }
  return null;
}
