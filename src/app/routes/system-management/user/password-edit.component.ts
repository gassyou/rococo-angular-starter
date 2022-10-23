import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
@Component({
  selector: 'app-password-edit',
  template: `
    <h2>
      {{ value.name }}
      <h2>
        <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100">
          <se
            label="{{ 'user.newPassword' | i18n }}"
            required
            [error]="{
              required: this.i18n.fanyi('user.askNewPsd'),
              minlength: this.i18n.fanyi('user.minlength'),
              maxlength: this.i18n.fanyi('user.maxlength')
            }"
          >
            <nz-input-group [nzSuffix]="newPwTemplate">
              <input
                [type]="newPWVisible ? 'text' : 'password'"
                nz-input
                placeholder="{{ 'user.askNewPsd' | i18n }}"
                formControlName="newPw"
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
              required: this.i18n.fanyi('user.askNewPsdAgain'),
              minlength: this.i18n.fanyi('user.minlength'),
              maxlength: this.i18n.fanyi('user.maxlength')
            }"
          >
            <nz-input-group [nzSuffix]="newPwConfirmTemplate">
              <input
                [type]="newPwConfirmVisible ? 'text' : 'password'"
                nz-input
                placeholder="{{ 'user.askNewPsdAgain' | i18n }}"
                formControlName="newPwConfirm"
              />
            </nz-input-group>
            <ng-template #newPwConfirmTemplate>
              <i nz-icon [nzType]="newPwConfirmVisible ? 'eye-invisible' : 'eye'" (click)="newPwConfirmVisible = !newPwConfirmVisible"></i>
            </ng-template>
          </se>
        </form>
      </h2>
    </h2>
  `,
  styles: []
})
export class PasswordEditComponent extends FormComponent implements OnInit {
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value: any;

  constructor(
    public userService: UserService,
    public fb: FormBuilder,
    public message: NzMessageService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {
    super(userService);
  }

  ngOnInit(): void {
    super.editForm = this.fb.group({
      id: [this.value ? this.value.id : null],
      newPw: [
        null,
        {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
          updateOn: 'blur'
        }
      ],
      newPwConfirm: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  submit(): Observable<any> | null {
    if (!super.isValidForm()) {
      return null;
    }

    if (this.editForm?.controls['newPwConfirm'].value !== this.editForm?.controls['newPw'].value) {
      this.message.error(this.i18n.fanyi('user.confirmPsdError'));
      return null;
    }
    return this.userService.updatePassword({
      id: this.editForm?.controls['id'].value,
      password: this.editForm?.controls['newPw'].value
    });
  }
}
