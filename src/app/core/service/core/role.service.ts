import { Inject, Injectable, Optional } from '@angular/core';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CRUDService } from 'src/app/freamwork/core/crud.service';

import { I18NService } from '../i18n.service';

@Injectable()
export class RoleService extends CRUDService {
  demoDataSource: any[] = [];
  constructor(http: _HttpClient, @Optional() message: NzMessageService, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(http, message, i18n);

    super.searchUrl = 'role/search';
    super.addUrl = 'role/add';
    super.deleteUrl = 'role/delete';
    super.updateUrl = 'role/update';
    super.allDataUrl = 'role/all';

    this.demoDataSource = [];
    for (let i = 0; i < 100; i++) {
      this.demoDataSource.push({
        name: `管理员${i}`,
        remark: 'test',
        enable: i % 2
      });
    }
  }
}
