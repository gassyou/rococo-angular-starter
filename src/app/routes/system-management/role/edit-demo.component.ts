import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/role.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

@Component({
  selector: 'app-edit-demo',
  template: `
    <form nz-form [formGroup]="editForm">
      <nz-input-group form-item required="true" [nzAddOnBefore]="addOnBeforeTemplate" [nzAddOnAfter]="addOnAfterTemplate">
        <input type="text" nz-input formControlName="website" placeholder="请输入角色website" />
      </nz-input-group>
      <ng-template #addOnBeforeTemplate>
        <nz-select [nzValue]="'Http://'">
          <nz-option nzLabel="Http://" nzValue="Http://"></nz-option>
          <nz-option nzLabel="Https://" nzValue="Https://"></nz-option>
        </nz-select>
      </ng-template>
      <ng-template #addOnAfterTemplate>
        <nz-select [nzValue]="'.com'">
          <nz-option nzLabel=".com" nzValue=".com"></nz-option>
          <nz-option nzLabel=".jp" nzValue=".jp"></nz-option>
          <nz-option nzLabel=".cn" nzValue=".cn"></nz-option>
          <nz-option nzLabel=".org" nzValue=".org"></nz-option>
        </nz-select>
      </ng-template>
      <input form-item required="true" nz-input formControlName="name" placeholder="请输入角色" />
      <nz-textarea-count form-item required="true" [nzMaxCharacterCount]="200">
        <textarea rows="3" nz-input formControlName="detail" placeholder="请输入角色说明"></textarea>
      </nz-textarea-count>
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

  ngOnInit(): void {
    this.isEdit = this.value ? true : false;
    this.editForm = this.fb.group({
      id: [this.value ? this.value.id : null],
      website: [this.value ? this.value.id : null],
      name: [
        this.value ? this.value.name : null,
        {
          validators: [Validators.required, Validators.maxLength(20)],
          // asyncValidators: [this.checkRoleNameValidator.bind(this)],
          updateOn: 'blur'
        }
      ],

      detail: [this.value ? this.value.detail : null, [Validators.required, Validators.maxLength(200)]]
    });
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
