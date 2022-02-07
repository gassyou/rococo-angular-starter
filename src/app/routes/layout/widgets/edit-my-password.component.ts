import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '@delon/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { isValidForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-password-edit',
  template: `
    <h2>
      Hi,{{ value }}!
      <span style="color:#9e9e9e;margin-left:5px; font-size:11px">请设置新密码！</span>
    </h2>
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="130">
      <se
        label="旧密码"
        required
        [error]="{
          required: '请输入旧密码',
          minlength: '密码长度不小于6位',
          maxlength: '密码长度不能超过20位'
        }"
      >
        <nz-input-group [nzSuffix]="oldPwTemplate">
          <input [type]="oldPWVisible ? 'text' : 'password'" nz-input placeholder="请输入旧密码" formControlName="oldPassword" />
        </nz-input-group>
        <ng-template #oldPwTemplate>
          <i nz-icon [nzType]="oldPWVisible ? 'eye-invisible' : 'eye'" (click)="oldPWVisible = !oldPWVisible"></i>
        </ng-template>
      </se>

      <se
        label="新密码"
        required
        [error]="{
          required: '请输入新密码',
          minlength: '密码长度不小于6位',
          maxlength: '密码长度不能超过20位'
        }"
      >
        <nz-input-group [nzSuffix]="newPwTemplate">
          <input [type]="newPWVisible ? 'text' : 'password'" nz-input placeholder="请输入新密码" formControlName="newPassword" />
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
          minlength: '密码长度不小于6位',
          maxlength: '密码长度不能超过20位',
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
    </form>
  `,
  styles: []
})
export class EditMyPasswordComponent implements OnInit {
  public editForm: FormGroup | undefined;

  oldPWVisible = false;
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value = '';

  constructor(public app: MyApplicationService, public fb: FormBuilder, public router: Router, public token: TokenService) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      id: [this.token.get().uid],
      oldPassword: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          updateOn: 'blur'
        }
      ],
      newPassword: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          updateOn: 'blur'
        }
      ],
      newPwConfirm: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20), this.checkConfirmPw.bind(this)],
          updateOn: 'blur'
        }
      ]
    });
  }

  submit(): Observable<any> | null {
    if (this.editForm?.controls['newPassword'].value !== this.editForm?.controls['newPwConfirm'].value) {
      return null;
    }

    if (!isValidForm(this.editForm)) {
      return null;
    }

    return this.app.updateMyPassword(this.editForm?.value).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  cancel() {}

  checkConfirmPw = (control: FormControl): { [key: string]: any } | null => {
    if (!control.value) {
      return { required: true };
    }
    if (this.editForm?.controls['newPassword'].value !== this.editForm?.controls['newPwConfirm'].value) {
      return { confirm: true, error: true };
    }
    return null;
  };
}
