import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApplicationService } from 'src/app/freamwork/core/application.service';

@Injectable({
  providedIn: 'root'
})
export class MyApplicationService extends ApplicationService {
  public appName: string = 'クーポン管理システム';
  public menuUrl: string = '';
  public actionAclUrl: string = '';
  public loginUrl: string = 'account/login';
  public myInfoUrl: string = 'sysUser/myInfo';
  public myInfoEditUrl: string = 'sysUser/changeUser';
  public myPasswordEditUrl: string = 'sysUser/update-password';
  public LOGIN_COOKIE_NAME: string = 'SHISEIDO20211101';
  public loginPageUrl: string = '/passport/login';
  public homePageUrl: string = '/';

  constructor(
    public http: _HttpClient,
    public message: NzMessageService,
    public router: Router,
    public token: TokenService,
    public acl: ACLService,
    public cache: CacheService
  ) {
    super(http, message, router, token, acl, cache);
  }
}
