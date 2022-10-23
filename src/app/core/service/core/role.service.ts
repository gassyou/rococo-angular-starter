import { Inject, Injectable, Optional } from '@angular/core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CRUDService } from 'src/app/freamwork/core/crud.service';

import { I18NService } from '../i18n.service';

@Injectable()
export class RoleService extends CRUDService {
  constructor(http: _HttpClient, @Optional() message: NzMessageService, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(http, message, i18n);

    super.searchUrl = 'roles';
    super.addUrl = 'role/add';
    super.deleteUrl = 'role/delete';
    super.updateUrl = 'role/update';
    super.allDataUrl = 'all-roles';
  }
}
