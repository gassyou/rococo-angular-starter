import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { AuthService } from 'src/app/core/service/core/auth.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';
import { emptyValidator } from 'src/app/shared/empty.validator';

@Component({
  selector: 'app-auth-page-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100">
      <se label="{{ 'auth.lblParent' | i18n }}">
        <div>{{ (value ? value.parentName : 'common.lbl.none') | i18n }}</div>
      </se>

      <se required label="{{ 'auth.lblText' | i18n }}" [error]="textError">
        <input nz-input formControlName="text" placeholder="{{ 'auth.lblText' | i18n }}" />
      </se>

      <se label="{{ 'auth.lblI18n' | i18n }}" [error]="i18nError">
        <input nz-input formControlName="i18n" placeholder="{{ 'auth.lblI18n' | i18n }}" />
      </se>

      <se label="{{ 'auth.lblIcon' | i18n }}" [error]="iconError">
        <input nz-input formControlName="icon" placeholder="{{ 'auth.lblIcon' | i18n }}" />
      </se>
    </form>
  `,
  styles: [``]
})
export class AuthTabEditComponent extends FormComponent implements OnInit {
  @Input()
  value?: FunctionModel;
  textError = {
    required: this.i18n.fanyi('common.msg.requireErr', { item: 'auth.lblText' }),
    maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'auth.lblText', length: 100 }),
    empty: this.i18n.fanyi('common.msg.empty')
  };
  i18nError = {
    maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'auth.lblI18n', length: 100 }),
    empty: this.i18n.fanyi('common.msg.empty')
  };
  iconError = {
    maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'auth.lblIcon', length: 100 }),
    empty: this.i18n.fanyi('common.msg.empty')
  };

  constructor(public authService: AuthService, public fb: UntypedFormBuilder, @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService) {
    super(authService);
  }
  ngOnInit(): void {
    this.isEdit = this.value?.text ? true : false;

    this.editForm = this.fb.group({
      id: [this.value?.id ? this.value?.id : null],
      parentId: [this.value?.parentId ? this.value?.parentId : null],
      moduleType: ['tab'],
      text: [this.value?.text ? this.value?.text : null, [Validators.required, Validators.maxLength(100), emptyValidator]],
      i18n: [this.value?.i18n ? this.value?.i18n : null, [Validators.maxLength(100), emptyValidator]],
      icon: [this.value?.icon ? this.value?.icon : null, [Validators.maxLength(100), emptyValidator]]
    });
  }
}
