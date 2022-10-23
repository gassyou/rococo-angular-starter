import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/core/role.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';
import { emptyValidator } from 'src/app/shared/empty.validator';

@Component({
  selector: 'app-edit',
  template: `
    <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100">
      <se
        label="{{ 'role.name' | i18n }}"
        required
        [error]="{
          required: this.i18n.fanyi('role.namePlaceholder'),
          maxlength: this.i18n.fanyi('role.nameMaxErrMsg'),
          serverError: this.i18n.fanyi('role.nameIsExistErrMsg'),
          validateNull: this.i18n.fanyi('commonErrMsg.validateNull')
        }"
      >
        <input nz-input formControlName="name" placeholder="{{ 'role.namePlaceholder' | i18n }}" />
      </se>

      <se
        label="{{ 'role.remark' | i18n }}"
        [error]="{
          maxlength: this.i18n.fanyi('role.remarkMaxErrMsg'),
          validateNull: this.i18n.fanyi('commonErrMsg.validateNull')
        }"
      >
        <nz-textarea-count [nzMaxCharacterCount]="200">
          <textarea rows="3" nz-input formControlName="remark" placeholder="{{ 'role.remarkPlaceholder' | i18n }}"></textarea>
        </nz-textarea-count>
      </se>
    </form>
  `,
  styles: []
})
export class EditComponent extends FormComponent implements OnInit {
  @Input()
  value: any;

  constructor(public roleService: RoleService, public fb: FormBuilder, @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService) {
    super(roleService);
  }

  ngOnInit(): void {
    this.isEdit = this.value ? true : false;
    this.editForm = this.fb.group({
      id: [this.value ? this.value.id : null],
      name: [
        this.value ? this.value.name : null,
        {
          validators: [Validators.required, Validators.maxLength(32), emptyValidator],
          asyncValidators: [this.checkRoleNameValidator.bind(this)],
          updateOn: 'blur'
        }
      ],
      remark: [this.value ? this.value.remark : null, [Validators.maxLength(200), emptyValidator]]
    });
  }

  // 验证角色名唯一性
  checkRoleNameValidator = (control: FormControl): { [key: string]: any } => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        name: this.editForm.controls['name'].value
      };
      return this.roleService.asyncValidate('/role/is-name-unique', param);
    }
    return of();
  };
}
