import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CRUDService } from './crud.service';
export abstract class FormComponent {
  public editForm: FormGroup | undefined;
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
        this.editForm.controls[i].markAsDirty();
        this.editForm.controls[i].updateValueAndValidity({ onlySelf: true });
      }
    }
    return this.editForm ? this.editForm.valid : false;
  }

  cancel() {}
}
