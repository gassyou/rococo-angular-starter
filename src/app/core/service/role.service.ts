import { Injectable, Optional } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CRUDService } from 'src/app/freamwork/core/crud.service';

@Injectable()
export class RoleService extends CRUDService {
  constructor(http: _HttpClient, @Optional() message: NzMessageService) {
    super(http, message);

    super.searchUrl = '/roles';
    super.addUrl = '/role/add';
    super.deleteUrl = '/role/delete';
    super.updateUrl = '/role/update';
    super.allDataUrl = '/all-roles';
  }
}
