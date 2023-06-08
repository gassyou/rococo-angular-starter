import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ALAIN_I18N_TOKEN, AlainThemeModule } from '@delon/theme';
import { AuthService } from 'src/app/core/service/core/auth.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';
import { emptyValidator } from 'src/app/shared/empty.validator';

import { AuthBaseEditComponent } from './auth-base-edit.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SEModule } from '@delon/abc/se';
import { NzFormModule } from 'ng-zorro-antd/form';

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

      <se label="{{ 'auth.lblIcon' | i18n }}" [error]="iconError">
        <input nz-input formControlName="icon" placeholder="{{ 'auth.lblIcon' | i18n }}" />
      </se>

      <se label="{{ 'auth.lblLink' | i18n }}" [error]="linkError">
        <input nz-input formControlName="link" placeholder="{{ 'auth.lblLink' | i18n }}" />
      </se>

      <se label="{{ 'auth.lblHide' | i18n }}">
        <nz-switch formControlName="hide"></nz-switch>
      </se>
      <se label="{{ 'auth.lblHideInBreadcrumb' | i18n }}">
        <nz-switch formControlName="hideInBreadcrumb"></nz-switch>
      </se>
      <se label="{{ 'auth.lblReuse' | i18n }}">
        <nz-switch formControlName="reuse"></nz-switch>
      </se>
    </form>
  `,
    styles: [``],
    standalone: true,
    imports: [FormsModule, NzFormModule, SEModule, ReactiveFormsModule, NzInputModule, NzSwitchModule, AlainThemeModule]
})
export class AuthPageEditComponent extends AuthBaseEditComponent implements OnInit {
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
      moduleType: ['page'],
      key: [
        this.value?.key ? this.value?.key : null,
        {
          validators: [Validators.required, Validators.maxLength(100), emptyValidator],
          asyncValidators: [this.checkKeyValidator.bind(this)],
          updateOn: 'blur'
        }
      ],
      text: [this.value?.text ? this.value?.text : null, [Validators.required, Validators.maxLength(100), emptyValidator]],
      i18n: [this.value?.i18n ? this.value?.i18n : null, [Validators.maxLength(100), emptyValidator]],
      icon: [this.value?.icon ? this.value?.icon : null, [Validators.maxLength(100), emptyValidator]],
      link: [this.value?.link ? this.value?.link : null, [Validators.maxLength(100), emptyValidator]],
      hide: [this.value?.hide ? this.value?.hide : 0],
      hideInBreadcrumb: [this.value?.hideInBreadcrumb ? this.value?.hideInBreadcrumb : 0],

      reuse: [this.value?.hideInBreadcrumb ? this.value?.hideInBreadcrumb : 0]
    });
  }
}
