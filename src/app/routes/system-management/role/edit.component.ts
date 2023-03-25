import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { Observable, of } from 'rxjs';
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
          required: this.i18n.fanyi('common.msg.requireErr', { item: 'role.name' }),
          maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'role.name', length: 32 }),
          serverError: this.i18n.fanyi('common.msg.itemExisted', { item: 'role.name' }),
          empty: this.i18n.fanyi('common.msg.emptyErr')
        }"
      >
        <input nz-input formControlName="name" placeholder="{{ 'role.name' | i18n }}" />
      </se>

      <se
        label="{{ 'role.remark' | i18n }}"
        [error]="{
          maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'role.remark', length: 200 }),
          empty: this.i18n.fanyi('common.msg.emptyErr')
        }"
      >
        <nz-textarea-count [nzMaxCharacterCount]="200">
          <textarea rows="3" nz-input formControlName="remark" placeholder="{{ 'role.remark' | i18n }}"></textarea>
        </nz-textarea-count>
      </se>
    </form>
  `,
  styles: []
})
export class EditComponent extends FormComponent implements OnInit {
  @Input()
  value: any;

  constructor(public roleService: RoleService, public fb: UntypedFormBuilder, @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService) {
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
  checkRoleNameValidator = (control: UntypedFormControl): Observable<ValidationErrors | null> => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        name: this.editForm.controls['name'].value
      };
      return this.roleService.asyncValidate('/role/is-name-unique', param);
    }
    return of(null);
  };
}
