import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApplicationService, MyInfo } from 'src/app/freamwork/core/application.service';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

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

    super.appName = 'Demo Application';
    super.menuUrl = 'app/menu';
    super.actionAclUrl = 'app/action';
    super.loginUrl = 'app/login';

    super.myInfoUrl = 'sys-user/my-info';
    super.myInfoEditUrl = 'sys-user/edit-my-info';
    super.myPasswordEditUrl = 'sys-user/update-my-password';

    super.LOGIN_COOKIE_NAME = 'KOTANI20221010';
    super.loginPageUrl = '/passport/login';
    super.homePageUrl = '/home';

    // super.demoPersonInfo = {
    //   id: 1,
    //   account: '001',
    //   name: 'demo',
    //   phone: '15168151772',
    //   mail: 'test@test.com',
    //   roleName: 'admin'
    // };

    // super.demoLoginResponeseInfo = {
    //   id: 1,
    //   token: 'adfdsasfdsa',
    //   longToken: 'adfdsasfdsasfdsasfds',
    //   roleList: [1]
    // };

    // super.demoMenuWithAclInfo = [
    //   new FunctionModel({ id: 1, i18n: '', groupFlag: 1, childCount: 1, module: 'module', text: 'DEMO系统', acl: [1] }),
    //   new FunctionModel({ id: 2, i18n: '', childCount: 0, parentId: 1, module: 'page', text: '首页', acl: [1], link: '/home' }),
    //   new FunctionModel({ id: 3, i18n: '', childCount: 3, parentId: 1, module: 'module', text: '系统管理', acl: [1] }),
    //   new FunctionModel({
    //     id: 4,
    //     childCount: 0,
    //     parentId: 3,
    //     module: 'page',
    //     text: '用户管理',
    //     parentText: '系统管理',
    //     link: '/sys/user',
    //     acl: [1]
    //   }),
    //   new FunctionModel({
    //     id: 5,
    //     childCount: 0,
    //     parentId: 3,
    //     module: 'page',
    //     text: '角色管理',
    //     parentText: '系统管理',
    //     link: '/sys/role',
    //     acl: [1]
    //   }),
    //   new FunctionModel({
    //     id: 6,
    //     childCount: 0,
    //     parentId: 3,
    //     module: 'page',
    //     text: '权限管理',
    //     parentText: '系统管理',
    //     link: '/sys/auth',
    //     acl: [1]
    //   })
    // ];

    super.demoActionWithACLInfo = [];
  }
}
