import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/core/role.service';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

@Component({
  selector: 'user-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="60">
      <se
        label="{{ 'user.name' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.askName'),
          maxLength: this.i18n.fanyi('user.maxNameLength')
        }"
      >
        <input nz-input formControlName="name" placeholder="{{ 'user.askName' | i18n }}" />
      </se>
      <se label="{{ 'user.role' | i18n }}">
        <nz-select formControlName="roleId" nzPlaceHolder="{{ 'user.askRole' | i18n }}" nzMode="multiple">
          <nz-option *ngFor="let role of roleList" [nzValue]="role.id" [nzLabel]="role.name"></nz-option>
        </nz-select>
      </se>
      <se
        label="{{ 'user.account' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.askAccount'),
          serverError: this.i18n.fanyi('user.serverAccountError')
        }"
      >
        <input nz-input formControlName="account" placeholder="{{ 'user.askAccount' | i18n }}" />
      </se>
      <se
        label="{{ 'user.email' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('user.askEmail'),
          serverError: this.i18n.fanyi('user.serverEmailError')
        }"
      >
        <input nz-input formControlName="mail" placeholder="{{ 'user.askEmail' | i18n }}" />
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
    public fb: FormBuilder,
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
      name: [this.value ? this.value.name : null, [Validators.required, Validators.maxLength(20)]],
      roleId: [this.value ? this.value.roleId : null],
      account: [
        this.value ? this.value.account : null,
        {
          validators: [Validators.required],
          asyncValidators: [this.checkAccountValidator.bind(this)],
          updateOn: 'blur'
        }
      ],
      mail: [
        this.value ? this.value.mail : null,
        {
          validators: [Validators.required],
          asyncValidators: [this.checkMobileValidator.bind(this)],
          updateOn: 'blur'
        }
      ]
    });
  }

  checkMobileValidator = (control: FormControl): { [key: string]: any } => {
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
  checkAccountValidator = (control: FormControl): { [key: string]: any } => {
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
