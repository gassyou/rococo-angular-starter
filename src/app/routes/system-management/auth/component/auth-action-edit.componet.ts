import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { AuthService } from 'src/app/core/service/core/auth.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';
import { emptyValidator } from 'src/app/shared/empty.validator';

import { AuthBaseEditComponent } from './auth-base-edit.component';

@Component({
  selector: 'app-auth-page-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="120">
      <se label="{{ 'auth.lblParent' | i18n }}">
        <div>{{ (value ? value.parentName : 'common.lbl.none') | i18n }}</div>
      </se>
      <se required label="Key" [error]="keyError">
        <input nz-input formControlName="key" placeholder="Key" />
      </se>

      <se required label="{{ 'auth.lblText' | i18n }}" [error]="textError">
        <input nz-input formControlName="text" placeholder="{{ 'auth.lblText' | i18n }}" />
      </se>

      <se label="{{ 'auth.lblI18n' | i18n }}" [error]="i18nError">
        <input nz-input formControlName="i18n" placeholder="{{ 'auth.lblI18n' | i18n }}" />
      </se>
    </form>
  `,
  styles: [``]
})
export class AuthActionEditComponent extends AuthBaseEditComponent implements OnInit {
  @Input()
  value?: FunctionModel;

  constructor(public authService: AuthService, public fb: UntypedFormBuilder, @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService) {
    super(authService, i18n);
  }
  ngOnInit(): void {
    this.isEdit = this.value?.text ? true : false;

    this.editForm = this.fb.group({
      id: [this.value?.id ? this.value?.id : null],
      parentId: [this.value?.parentId ? this.value?.parentId : null],
      moduleType: ['action'],
      key: [
        this.value?.key ? this.value?.key : null,
        {
          Validators: [Validators.required, Validators.maxLength(100), emptyValidator],
          asyncValidators: [this.checkKeyValidator.bind(this)],
          updateOn: 'blur'
        }
      ],
      text: [this.value?.text ? this.value?.text : null, [Validators.required, Validators.maxLength(100), emptyValidator]],
      i18n: [this.value?.i18n ? this.value?.i18n : null, [Validators.maxLength(100), emptyValidator]]
    });
  }
}
