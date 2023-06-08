import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ALAIN_I18N_TOKEN, AlainThemeModule } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SEModule } from '@delon/abc/se';
import { NzFormModule } from 'ng-zorro-antd/form';
@Component({
    selector: 'app-password-edit',
    template: `
    <h2>
      {{ value.name }}
      <h2>
        <form nz-form [formGroup]="editForm" se-container="1" nzLayout="vertical" labelWidth="120">
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
              required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.newPasswordComfirm' }),
              minlength: this.i18n.fanyi('common.msg.minLengthErr', { item: 'user.newPasswordComfirm', length: 6 }),
              maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.newPasswordComfirm', length: 20 })
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
      </h2>
    </h2>
  `,
    styles: [],
    standalone: true,
    imports: [FormsModule, NzFormModule, SEModule, ReactiveFormsModule, NzButtonModule, NzInputModule, NzIconModule, AlainThemeModule]
})
export class PasswordEditComponent extends FormComponent implements OnInit {
  newPWVisible = false;
  newPwConfirmVisible = false;

  @Input()
  value: any;

  constructor(
    public userService: UserService,
    public fb: UntypedFormBuilder,
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
