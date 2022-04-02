import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/core/service/user.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

@Component({
  selector: 'app-password-edit',
  template: `
    <h2
      >{{ value.name
      }}<h2>
        <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100">
          <se
            label="旧密码"
            required
            [error]="{ required: '请输入旧密码', maxlength: '最大不能超过20位', minlength: '最小不少于6位', serverError: '旧密码错误' }"
          >
            <nz-input-group [nzSuffix]="pwTemplate">
              <input [type]="oldPWVisible ? 'text' : 'password'" nz-input placeholder="请输入旧密码" formControlName="oldPw" />
            </nz-input-group>
            <ng-template #pwTemplate>
              <i nz-icon [nzType]="oldPWVisible ? 'eye-invisible' : 'eye'" (click)="oldPWVisible = !oldPWVisible"></i>
            </ng-template>
          </se>
          <se
            label="新密码"
            required
            [error]="{
              required: '请输入新密码',
              minlength: '最小不少于6位',
              maxlength: '最大不能超过20位',
              serverError: '新密码和旧密码一致'
            }"
          >
            <nz-input-group [nzSuffix]="newPwTemplate">
              <input [type]="newPWVisible ? 'text' : 'password'" nz-input placeholder="请输入新密码" formControlName="newPw" />
            </nz-input-group>
            <ng-template #newPwTemplate>
              <i nz-icon [nzType]="newPWVisible ? 'eye-invisible' : 'eye'" (click)="newPWVisible = !newPWVisible"></i>
            </ng-template>
          </se>
          <se
            label="新密码确认"
            required
            [error]="{
              required: '请再次输入新密码',
              minlength: '最小不少于6位',
              maxlength: '最大不能超过20位',
              confirm: '两次密码输入不一致'
            }"
          >
            <nz-input-group [nzSuffix]="newPwConfirmTemplate">
              <input
                [type]="newPwConfirmVisible ? 'text' : 'password'"
                nz-input
                placeholder="请再次输入新密码"
                formControlName="newPwConfirm"
              />
            </nz-input-group>
            <ng-template #newPwConfirmTemplate>
              <i nz-icon [nzType]="newPwConfirmVisible ? 'eye-invisible' : 'eye'" (click)="newPwConfirmVisible = !newPwConfirmVisible"></i>
            </ng-template>
          </se>
        </form> </h2
    ></h2>
  `,
  styles: []
})
export class PasswordEditComponent extends FormComponent implements OnInit {
  oldPWVisible = false;
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value: any;

  constructor(public userService: UserService, public fb: FormBuilder) {
    super(userService);
  }

  ngOnInit(): void {
    super.editForm = this.fb.group({
      id: [this.value ? this.value.id : null],
      oldPw: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          asyncValidators: [this.checkOldPassword.bind(this)],
          updateOn: 'blur'
        }
      ],
      newPw: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          asyncValidators: [this.checkSameWidthOldPW.bind(this)],
          updateOn: 'blur'
        }
      ],
      newPwConfirm: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), this.checkConfirmPw.bind(this)]]
    });
  }

  submit(): Observable<any> | null {
    if (!super.isValidForm()) {
      return null;
    }
    return this.userService.updatePassword({
      id: super.editForm?.controls['id'].value,
      newPw: super.editForm?.controls['newPw'].value
    });
  }

  checkConfirmPw = (control: FormControl): { [key: string]: any } | null => {
    if (!control.value) {
      return { required: true };
    }
    if (super.editForm?.controls['newPwConfirm'].value !== super.editForm?.controls['newPw'].value) {
      return { confirm: true, error: true };
    }
    return null;
  };

  checkSameWidthOldPW = (control: FormControl): { [key: string]: any } => {
    if (super.editForm && control.value) {
      const param = {
        id: super.editForm.controls['id'].value,
        newPw: super.editForm.controls['newPw'].value
      };
      return this.userService.asyncValidate('/user/check-new-pw', param);
    }
    return of();
  };

  checkOldPassword = (control: FormControl): { [key: string]: any } => {
    if (super.editForm && control.value) {
      const param = {
        id: super.editForm.controls['id'].value,
        oldPw: super.editForm.controls['oldPw'].value
      };
      return this.userService.asyncValidate('/user/check-old-pw', param);
    }
    return of();
  };
}
