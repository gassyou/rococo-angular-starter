import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { encryptForServer } from 'src/app/freamwork/util/crypto';
import { isValidForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-password-edit',
  template: `
    <h2>
      Hi,{{ value }}!
      <span style="color:#9e9e9e;margin-left:5px; font-size:11px">{{ 'user.passwordChange' | i18n }}</span>
    </h2>
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="130">
      <se
        label="{{ 'user.oldPw' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.oldPwAsk'),
          minlength: this.i18n.fanyi('user.minlength'),
          maxlength: this.i18n.fanyi('user.maxlength'),
          serverError: this.i18n.fanyi('user.oldPwNotCorrect')
        }"
      >
        <nz-input-group [nzSuffix]="oldPwTemplate">
          <input
            [type]="oldPWVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.oldPwAsk' | i18n }}"
            formControlName="oldPassword"
          />
        </nz-input-group>
        <ng-template #oldPwTemplate>
          <i nz-icon [nzType]="oldPWVisible ? 'eye-invisible' : 'eye'" (click)="oldPWVisible = !oldPWVisible"></i>
        </ng-template>
      </se>

      <se
        label="{{ 'user.newPassword' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.newPasswordAsk'),
          minlength: this.i18n.fanyi('user.minlength'),
          maxlength: this.i18n.fanyi('user.maxlength')
        }"
      >
        <nz-input-group [nzSuffix]="newPwTemplate">
          <input
            [type]="newPWVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.newPasswordAsk' | i18n }}"
            formControlName="newPassword"
          />
        </nz-input-group>
        <ng-template #newPwTemplate>
          <i nz-icon [nzType]="newPWVisible ? 'eye-invisible' : 'eye'" (click)="newPWVisible = !newPWVisible"></i>
        </ng-template>
      </se>
      <se
        label="{{ 'user.newPasswordComfirm' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.newPasswordComfirmAsk'),
          minlength: this.i18n.fanyi('user.minlength'),
          maxlength: this.i18n.fanyi('user.maxlength'),
          confirm: this.i18n.fanyi('user.confirmPsdError')
        }"
      >
        <nz-input-group [nzSuffix]="newPwConfirmTemplate">
          <input
            [type]="newPwConfirmVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.newPasswordComfirmAsk' | i18n }}"
            formControlName="newPwConfirm"
          />
        </nz-input-group>
        <ng-template #newPwConfirmTemplate>
          <i nz-icon [nzType]="newPwConfirmVisible ? 'eye-invisible' : 'eye'" (click)="newPwConfirmVisible = !newPwConfirmVisible"></i>
        </ng-template>
      </se>
    </form>
  `,
  styles: [],
  providers: [UserService, NzNotificationService]
})
export class EditMyPasswordComponent implements OnInit {
  public editForm: FormGroup | undefined;

  oldPWVisible = false;
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value = '';

  constructor(
    public app: MyApplicationService,
    public fb: FormBuilder,
    public router: Router,
    public token: TokenService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
    private messageService: NzMessageService,
    public userServie: UserService,
    private notification: NzNotificationService
  ) {
    this.messageService.remove();
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      id: [this.token.get().uid],
      oldPassword: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          asyncValidators: [this.checkOldPw.bind(this)],
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
    if (!isValidForm(this.editForm)) {
      return null;
    }

    if (this.editForm?.controls['oldPassword'].value === this.editForm?.controls['newPassword'].value) {
      // this.notification.error(this.i18n.fanyi("user.serverError"), "", {
      //   nzPlacement: 'topRight',
      //   nzDuration: 3000,
      // });
      this.messageService.error(this.i18n.fanyi('user.serverError'));
      return null;
    }

    if (this.editForm?.controls['newPassword'].value !== this.editForm?.controls['newPwConfirm'].value) {
      // this.notification.error(this.i18n.fanyi("user.confirmPsdError"), "", {
      //   nzPlacement: 'topRight',
      //   nzDuration: 3000,
      // });
      this.messageService.error(this.i18n.fanyi('user.confirmPsdError'));
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

  checkOldPw = (control: FormControl): { [key: string]: any } | null => {
    if (!control.value) {
      return of();
    }
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        oldPassword: encryptForServer(this.editForm.controls['oldPassword'].value)
      };
      return this.userServie.asyncValidate('sys-user/check-password', param);
    }
    return of();
  };
}
