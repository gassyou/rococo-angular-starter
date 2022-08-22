import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/core/role.service';
import { UserService } from 'src/app/core/service/core/user.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

@Component({
  selector: 'user-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="60">
      <se label="姓名" required [error]="{ required: '请输入姓名', maxLength: '名字最大不能超过20' }">
        <input nz-input formControlName="name" placeholder="请输入姓名" />
      </se>
      <se label="角色">
        <nz-select formControlName="role" nzPlaceHolder="请选择角色">
          <nz-option *ngFor="let role of roleList" [nzValue]="role.id" [nzLabel]="role.name"></nz-option>
        </nz-select>
      </se>
      <se label="电话" required [error]="{ required: '请输入电话', serverError: '电话号码重复' }">
        <input nz-input formControlName="mobile" placeholder="请输入姓名" />
      </se>
    </form>
  `
})
export class EditComponent extends FormComponent implements OnInit {
  @Input()
  value: any;

  roleList: any[] = [];

  constructor(public roleService: RoleService, public userService: UserService, public fb: FormBuilder) {
    super(userService);
  }

  ngOnInit(): void {
    super.isEdit = this.value ? true : false;
    this.roleService.all()?.subscribe((result: any) => {
      this.roleList = result.records;
    });
    super.editForm = this.fb.group({
      id: [this.value ? this.value.id : null],
      name: [this.value ? this.value.name : null, [Validators.required, Validators.maxLength(20)]],
      role: [this.value ? this.value.role : null],
      mobile: [
        this.value ? this.value.mobile : null,
        { validators: [Validators.required], asyncValidators: [this.checkMobileValidator.bind(this)], updateOn: 'blur' }
      ]
    });
  }

  checkMobileValidator = (control: FormControl): { [key: string]: any } => {
    if (super.editForm && control.value) {
      const param = {
        id: super.editForm.controls['id'].value,
        mobile: super.editForm.controls['mobile'].value
      };
      return this.userService.asyncValidate('/user/check-mobile', param);
    }
    return of();
  };
}
