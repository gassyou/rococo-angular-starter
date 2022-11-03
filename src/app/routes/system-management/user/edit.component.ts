import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/core/role.service';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
import { emptyValidator } from 'src/app/shared/empty.validator';

@Component({
  selector: 'user-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="60">
      <se
        label="{{ 'user.name' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.name' }),
          empty: this.i18n.fanyi('common.msg.emptyErr'),
          maxLength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.name', length: 20 })
        }"
      >
        <input nz-input formControlName="name" placeholder="{{ 'user.name' | i18n }}" />
      </se>
      <se label="{{ 'user.role' | i18n }}">
        <nz-select formControlName="roleId" nzPlaceHolder="{{ 'user.role' | i18n }}" nzMode="multiple">
          <nz-option *ngFor="let role of roleList" [nzValue]="role.id" [nzLabel]="role.name"></nz-option>
        </nz-select>
      </se>
      <se
        label="{{ 'user.account' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.account' }),
          empty: this.i18n.fanyi('common.msg.emptyErr'),
          maxLength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.account', length: 20 }),
          serverError: editForm?.controls['account'].errors.serverError
        }"
      >
        <input nz-input formControlName="account" placeholder="{{ 'user.account' | i18n }}" />
      </se>
      <se
        label="{{ 'user.email' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'user.email' }),
          empty: this.i18n.fanyi('common.msg.emptyErr'),
          serverError: editForm?.controls['mail'].errors.serverError,
          maxLength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'user.email', length: 100 })
        }"
      >
        <input nz-input formControlName="mail" placeholder="{{ 'user.email' | i18n }}" />
      </se>
    </form>
  `
})
export class EditComponent extends FormComponent implements OnInit {
  @Input()
  value: any;

  roleList: any[] = [];

  constructor(
    public roleService: RoleService,
    public userService: UserService,
    public fb: UntypedFormBuilder,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {
    super(userService);
  }

  ngOnInit(): void {
    super.isEdit = this.value ? true : false;
    this.roleService.all()?.subscribe((result: any) => {
      this.roleList = result;
    });

    super.editForm = this.fb.group({
      id: [this.value ? this.value.id : ''],
      name: [this.value ? this.value.name : null, [Validators.required, Validators.maxLength(20), emptyValidator]],
      roleId: [this.value ? this.value.roleId : null],
      account: [
        this.value ? this.value.account : null,
        {
          validators: [Validators.required, emptyValidator, Validators.maxLength(20)],
          asyncValidators: [this.checkAccountValidator.bind(this)],
          updateOn: 'blur'
        }
      ],
      mail: [
        this.value ? this.value.mail : null,
        {
          validators: [Validators.required, emptyValidator, Validators.maxLength(100)],
          asyncValidators: [this.checkEmailValidator.bind(this)],
          updateOn: 'blur'
        }
      ]
    });
  }

  checkEmailValidator = (control: UntypedFormControl): { [key: string]: any } => {
    if (!control.value) {
      return of();
    }

    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        mail: this.editForm.controls['mail'].value
      };
      return this.userService.asyncValidate('/sys-user/is-mail-unique', param);
    }
    return of();
  };
  // 验证account唯一性
  checkAccountValidator = (control: UntypedFormControl): { [key: string]: any } => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        account: this.editForm.controls['account'].value
      };
      return this.userService.asyncValidate('/sys-user/is-account-unique', param);
    }
    return of();
  };
}
