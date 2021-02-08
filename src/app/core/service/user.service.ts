import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CRUDService } from './crud.service';

@Injectable()
export class UserService extends CRUDService {


  constructor(
    http: _HttpClient,
    message: NzMessageService
  ) {
    super(http, message);

    super.searchUrl = '/users';
    super.addUrl = '/user/add';
    super.deleteUrl = '/user/delete';
    super.updateUrl = '/user/update';
    super.exportUrl = '/user/export';
  }

}
