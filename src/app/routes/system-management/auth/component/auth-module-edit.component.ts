import { AuthService } from "src/app/core/service/core/auth.service";
import { FunctionModel } from "src/app/routes/system-management/auth/entity/function-model";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ALAIN_I18N_TOKEN } from "@delon/theme";
import { I18NService } from "src/app/core/service/i18n.service";
import { FormComponent } from "src/app/freamwork/core/form-component";
import { emptyValidator } from "src/app/shared/validator/empty.validator";

@Component({
  selector: "app-auth-module-edit",
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100">
      <se label="{{ 'auth.lblParent' | i18n }}">
        <div>{{ (value ? value.parentName : "common.none") | i18n }}</div>
      </se>

      <se required label="{{ 'auth.lblText' | i18n }}" [error]="textError">
        <input
          nz-input
          formControlName="text"
          placeholder="{{ 'auth.lblTextPlaceholder' | i18n }}"
        />
      </se>

      <se label="{{ 'auth.lblI18n' | i18n }}" [error]="i18nError">
        <input
          nz-input
          formControlName="i18n"
          placeholder="{{ 'auth.lblI18nPlaceholder' | i18n }}"
        />
      </se>

      <se label="{{ 'auth.lblIcon' | i18n }}" [error]="iconError">
        <input
          nz-input
          formControlName="icon"
          placeholder="{{ 'auth.lblIconPlaceholder' | i18n }}"
        />
      </se>

      <se label="{{ 'auth.lblLink' | i18n }}" [error]="linkError">
        <input
          nz-input
          formControlName="link"
          placeholder="{{ 'auth.lblLinkPlaceholder' | i18n }}"
        />
      </se>

      <se label="{{ 'auth.lblHide' | i18n }}">
        <nz-switch formControlName="hide"></nz-switch>
      </se>
      <se label="{{ 'auth.lblGroup' | i18n }}">
        <nz-switch formControlName="groupFlag"></nz-switch>
      </se>
      <se label="{{ 'auth.lblHideInBreadcrumb' | i18n }}">
        <nz-switch formControlName="hideInBreadcrumb"></nz-switch>
      </se>
    </form>
  `,
  styles: [``],
})
export class AuthModuleEditComponent extends FormComponent implements OnInit {
  @Input()
  value?: FunctionModel;

  textError = {
    required: this.i18n.fanyi("auth.lblTextPlaceholder"),
    maxlength: this.i18n.fanyi("auth.lblTextLengthError"),
    validateNull: this.i18n.fanyi("commonErrMsg.validateNull"),
  };
  i18nError = {
    maxlength: this.i18n.fanyi("auth.lblI18nLengthError"),
    validateNull: this.i18n.fanyi("commonErrMsg.validateNull"),
  };
  iconError = {
    maxlength: this.i18n.fanyi("auth.lblIconLengthError"),
    validateNull: this.i18n.fanyi("commonErrMsg.validateNull"),
  };
  linkError = {
    maxlength: this.i18n.fanyi("auth.lblLinkLengthError"),
    validateNull: this.i18n.fanyi("commonErrMsg.validateNull"),
  };

  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {
    super(authService);
  }
  ngOnInit(): void {

    this.isEdit = this.value?.text ? true : false;

    this.editForm = this.fb.group({
      id: [this.value?.id ? this.value?.id : null],
      parentId: [this.value?.parentId ? this.value?.parentId : null],
      moduleType: ["module"],
      text: [
        this.value?.text ? this.value?.text : null,
        [Validators.required, Validators.maxLength(100), emptyValidator],
      ],
      i18n: [
        this.value?.i18n ? this.value?.i18n : null,
        [Validators.maxLength(100), emptyValidator],
      ],
      icon: [
        this.value?.icon ? this.value?.icon : null,
        [Validators.maxLength(100), emptyValidator],
      ],
      link: [
        this.value?.link ? this.value?.link : null,
        [Validators.maxLength(100), emptyValidator],
      ],
      hide:[
        this.value?.hide ? this.value?.hide : 0,
      ],
      groupFlag:[
        this.value?.groupFlag ? this.value?.groupFlag : 0,
      ],
      hideInBreadcrumb:[
        this.value?.hideInBreadcrumb ? this.value?.hideInBreadcrumb : 0,
      ],
    });
  }
}
