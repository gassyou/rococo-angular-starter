import { UntypedFormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { I18NService } from 'src/app/core/service/i18n.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

export class AuthBaseEditComponent extends FormComponent {
  keyError = {
    required: this.i18n.fanyi('common.msg.requireErr', { item: 'Key' }),
    maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'Key', length: 100 }),
    empty: this.i18n.fanyi('common.msg.empty'),
    serverError:
      this.editForm && this.editForm.controls['key'] && this.editForm.controls['key'].errors
        ? this.editForm.controls['key'].errors['serverError']
        : this.i18n.fanyi('common.msg.duplicateErr', { item: 'Key' })
  };

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
  linkError = {
    maxlength: this.i18n.fanyi('common.msg.maxLengthErr', { item: 'auth.lblLink', length: 100 }),
    empty: this.i18n.fanyi('common.msg.empty')
  };

  constructor(public crudService: CRUDService, public i18n: I18NService) {
    super(crudService);
  }

  checkKeyValidator = (control: UntypedFormControl): Observable<ValidationErrors | null> => {
    if (this.editForm && control.value) {
      const param = {
        id: this.editForm.controls['id'].value,
        mail: this.editForm.controls['key'].value
      };
      return this.crudService.asyncValidate('/auth/is-key-unique', param);
    }
    return of(null);
  };
}
