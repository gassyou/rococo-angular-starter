import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApplicationService } from 'src/app/freamwork/core/application.service';

import { I18NService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class MyApplicationService extends ApplicationService {
  constructor(
    public http: _HttpClient,
    public message: NzMessageService,
    public router: Router,
    public token: TokenService,
    public acl: ACLService,
    public cache: CacheService,
    @Inject(ALAIN_I18N_TOKEN) i18n: I18NService
  ) {
    super(http, message, router, token, acl, cache, i18n);
    super.menuUrl = 'app/menu';
    super.actionAclUrl = 'app/action';
    super.loginUrl = 'app/login';

    super.myInfoUrl = 'sys-user/my-info';
    super.myInfoEditUrl = 'sys-user/edit-my-info';
    super.myPasswordEditUrl = 'sys-user/update-my-password';

    super.LOGIN_COOKIE_NAME = 'KOTANI20221010';
    super.loginPageUrl = '/passport/login';
    super.homePageUrl = '/home';
  }
}
