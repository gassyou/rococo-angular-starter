import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, AlainThemeModule } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { encryptForServer } from 'src/app/freamwork/util/crypto';
import { isValidForm } from 'src/app/freamwork/util/form-valid-checker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SEModule } from '@delon/abc/se';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
    selector: 'app-password-edit',
    template: `
    <h2>
      Hi,{{ value }}!
      <span style="color:#9e9e9e;margin-left:5px; font-size:11px">{{ 'user.changePassword' | i18n }}</span>
    </h2>
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="150" nzLayout="vertical">
      <se
        label="{{ 'user.oldPw' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.oldPw' }),
          minlength: this.i18n.fanyi('common.msg.minLengthErr', { item: 'user.oldPw', length: 6 }),
          maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.oldPw', length: 20 }),
          serverError: editForm?.controls['oldPassword'].errors.serverError
        }"
      >
        <nz-input-group [nzSuffix]="oldPwTemplate">
          <input
            [type]="oldPWVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.oldPw' | i18n }}"
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
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.newPassword' }),
          minlength: this.i18n.fanyi('common.msg.minLengthErr', { item: 'user.newPassword', length: 6 }),
          maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.newPassword', length: 20 })
        }"
      >
        <nz-input-group [nzSuffix]="newPwTemplate">
          <input
            [type]="newPWVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.newPassword' | i18n }}"
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
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.newPasswordComfirm' }),
          minlength: this.i18n.fanyi('common.msg.minLengthErr', { item: 'user.newPasswordComfirm', length: 6 }),
          maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.newPasswordComfirm', length: 20 }),
          confirm: this.i18n.fanyi('user.confirmPsdError')
        }"
      >
        <nz-input-group [nzSuffix]="newPwConfirmTemplate">
          <input
            [type]="newPwConfirmVisible ? 'text' : 'password'"
            nz-input
            placeholder="{{ 'user.newPasswordComfirm' | i18n }}"
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
    providers: [UserService, NzNotificationService],
    standalone: true,
    imports: [FormsModule, NzFormModule, SEModule, ReactiveFormsModule, NzButtonModule, NzInputModule, NzIconModule, AlainThemeModule]
})
export class EditMyPasswordComponent implements OnInit {
  public editForm: UntypedFormGroup | undefined;

  oldPWVisible = false;
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value = '';

  constructor(
    public app: MyApplicationService,
    public fb: UntypedFormBuilder,
    public router: Router,
    public token: TokenService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
    private messageService: NzMessageService,
    public userServie: UserService
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
      this.messageService.error(this.i18n.fanyi('user.sameWithOldPwError'));
      return null;
    }

    if (this.editForm?.controls['newPassword'].value !== this.editForm?.controls['newPwConfirm'].value) {
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

  checkConfirmPw = (control: UntypedFormControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: true };
    }
    if (this.editForm?.controls['newPassword'].value !== this.editForm?.controls['newPwConfirm'].value) {
      return { confirm: true, error: true };
    }
    return null;
  };

  checkOldPw = (control: UntypedFormControl): Observable<ValidationErrors | null> => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        oldPassword: encryptForServer(this.editForm.controls['oldPassword'].value)
      };
      return this.userServie.asyncValidate('sys-user/check-password', param);
    }
    return of(null);
  };
}
