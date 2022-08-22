import { Injectable, Optional } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CRUDService } from '../../../freamwork/core/crud.service';

@Injectable()
export class UserService extends CRUDService {
  constructor(http: _HttpClient, @Optional() message: NzMessageService) {
    super(http, message);

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
