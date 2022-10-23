import { Inject, Injectable, Optional } from '@angular/core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CRUDService } from '../../../freamwork/core/crud.service';
import { I18NService } from '../i18n.service';

@Injectable()
export class UserService extends CRUDService {
  constructor(http: _HttpClient, @Optional() message: NzMessageService, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(http, message, i18n);

    super.searchUrl = '/users';
    super.addUrl = '/user/add';
    super.deleteUrl = '/user/delete';
    super.updateUrl = '/user/update';
    super.exportUrl = '/user/export';
  }

  public updatePassword(data: any): Observable<any> {
    return super.http.post('/user/update-password', data).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          super.message.info('修改成功');
          return response.data;
        } else {
          super.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }
}
