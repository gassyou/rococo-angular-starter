import { Inject, Injectable, Optional, Type } from '@angular/core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { AuthActionComponent } from 'src/app/routes/system-management/auth/component/auth-action.component';
import { AuthBaseComponent } from 'src/app/routes/system-management/auth/component/auth-base.component';
import { AuthModuleComponent } from 'src/app/routes/system-management/auth/component/auth-module.component';
import { AuthComboViewModel } from 'src/app/routes/system-management/auth/view-model/auth-combo-view-model';
import { AuthItemViewModel } from 'src/app/routes/system-management/auth/view-model/auth-item-view-model';
import { AuthViewModel } from 'src/app/routes/system-management/auth/view-model/auth-view-model';

import { FunctionModel } from '../../../routes/system-management/auth/entity/function-model';
import { I18NService } from '../i18n.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CRUDService {
  constructor(http: _HttpClient, @Optional() message: NzMessageService, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(http, message, i18n);

    super.searchUrl = 'function/all';
    super.addUrl = 'function/add';
    super.deleteUrl = 'function/delete';
    super.updateUrl = 'function/update';
  }

  public beforeFormCommit: (<T, P>(formValue: any) => any) | undefined = formValue => {
    formValue.groupFlag = formValue.groupFlag ? 1 : 0;
    formValue.hide = formValue.hide ? 1 : 0;
    formValue.hideInBreadcrumb = formValue.hideInBreadcrumb ? 1 : 0;
    formValue.reuse = formValue.reuse ? 1 : 0;
    return formValue;
  };

  public updateAuth(data: { roleId: number; functionIdList: number[] }): Observable<any> {
    return this.http.post('function/update-auth', data).pipe(
      map(response => {
        if (!response.meta.success) {
          this.message.error(response['meta']['message']);
          return response;
        }
        this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
        return response.data;
      })
    );
  }
}

export const componentType: { [key: string]: Type<AuthBaseComponent> } = {
  module: AuthModuleComponent,
  page: AuthModuleComponent,
  tab: AuthModuleComponent,
  action: AuthActionComponent
};

export function viewModelFactory(data: FunctionModel): AuthViewModel {
  return data.isLeaf
    ? new AuthItemViewModel(componentType[data.moduleType], data)
    : new AuthComboViewModel(componentType[data.moduleType], data);
}
