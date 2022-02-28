import { FormGroup } from '@angular/forms';
import { environment } from '@env/environment';

export function isValidForm(form: FormGroup | undefined) {
  if (!form) {
    return false;
  }
  for (const i in form.controls) {
    if (form.contains(i)) {
      form.controls[i].markAsDirty();
      form.controls[i].updateValueAndValidity({ onlySelf: true });
    }
  }
  return form.valid;
}

/**
 * 这是一个方法装饰器。使用方法`@CheckForm(formName)`
 * 在表单提交前，进行判断表单中各个输入项目是否正常。
 *
 * @param form 表单变量
 * @returns
 */
export function CheckForm(form: any) {
  return (target: any, propOrMethod: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      return;
    }
    const originalMethod = descriptor?.value;
    descriptor.value = function () {
      const args = arguments;
      if (!this[form]) {
        throw new Error(`${form} is not exist.`);
      }

      for (const i in this[form].controls) {
        if (this[form].contains(i)) {
          this[form].controls[i].markAsDirty();
          this[form].controls[i].updateValueAndValidity({ onlySelf: true });
        }
      }

      if (!this[form].valid) {
        return;
      }

      originalMethod.apply(this, args);
    };
  };
}
