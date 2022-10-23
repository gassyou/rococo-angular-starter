import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CRUDService } from './crud.service';
export abstract class FormComponent {
  public editForm: UntypedFormGroup | undefined;
  public isEdit: boolean = false;

  constructor(public crudService: CRUDService) {}

  submit(): Observable<any> | null {
    if (!this.isValidForm()) {
      return null;
    }

    if (this.isEdit) {
      return this.crudService.update(this.editForm?.value);
    } else {
      return this.crudService.add(this.editForm?.value);
    }
  }

  isValidForm(): boolean {
    for (const i in this.editForm?.controls) {
      if (this.editForm?.contains(i)) {
        this.makeControlDirty(this.editForm.controls[i]);
      }
    }
    return this.editForm ? this.editForm.valid : false;
  }

  cancel() {}

  makeControlDirty(control: AbstractControl) {
    if (control instanceof UntypedFormControl) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }

    if (control instanceof UntypedFormGroup) {
      for (const i in control.controls) {
        if (control.contains(i)) {
          this.makeControlDirty(control.controls[i]);
        }
      }
    }

    if (control instanceof UntypedFormArray) {
      for (let item of control.controls) {
        this.makeControlDirty(item);
      }
    }
  }
}
