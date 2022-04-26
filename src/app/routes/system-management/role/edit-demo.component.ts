import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { RoleService } from 'src/app/core/service/role.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
import { CheckForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-edit-demo',
  template: `
    <form nz-form [formGroup]="editForm">
      <input nz-input formControlName="name" placeholder="Name" />
      <input nz-input formControlName="age" placeholder="age" />
      <div formArrayName="addressList">
        <button nz-button (click)="addAddress()">+ Add another Address</button>
        <ng-container *ngFor="let item of addressList.controls; let i = index">
          <div [formGroupName]="i">
            <input nz-input formControlName="street" placeholder="Street" />
            <input nz-input formControlName="city" placeholder="city" />
            <input nz-input formControlName="state" placeholder="state" />
          </div>
        </ng-container>
      </div>
    </form>
  `,
  styles: []
})
export class EditDemoComponent extends FormComponent implements OnInit {
  @Input()
  value: any;

  constructor(public roleService: RoleService, public fb: FormBuilder) {
    super(roleService);
  }

  get addressList() {
    return this.editForm?.get('addressList') as FormArray;
  }

  addAddress() {
    this.addressList.push(
      this.fb.group({
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required]
      })
    );
  }

  ngOnInit(): void {
    this.isEdit = this.value ? true : false;
    this.editForm = this.fb.group({
      name: [this.value?.name, Validators.required],
      age: [this.value?.age, Validators.required],
      addressList: this.fb.array(
        this.value?.address?.map((item: any) => {
          return this.fb.group({
            street: [item.street, Validators.required],
            city: [item.city, Validators.required],
            state: [item.state, Validators.required]
          });
        })
      )
    });
  }

  @CheckForm('editForm')
  submit(): Observable<any> | null {
    return of(this.editForm?.value);
  }

  checkRoleNameValidator = (control: FormControl): { [key: string]: any } => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        name: this.editForm.controls['name'].value
      };
      return this.roleService.asyncValidate('/role/check-name', param);
    }
    return of();
  };
}
