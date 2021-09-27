import { FormGroup } from '@angular/forms';

export function formValidChecker(form: FormGroup) {
  for (const i in form.controls) {
    if (form.contains(i)) {
      form.controls[i].markAsDirty();
      form.controls[i].updateValueAndValidity({ onlySelf: true });
    }
  }
  return form.valid;
}
