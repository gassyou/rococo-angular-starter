import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { Menu, _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { I18NService } from 'src/app/core/service/i18n.service';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

import { getCookie, setCookie } from '../util/cookie-util';
import { encryptForServer } from '../util/crypto';
import { buildTree } from '../util/tree/tree';
import { MyMenu } from './my-menu';
import { ResponseData, ResponseContentData } from './response-data';

@Injectable({
  providedIn: 'root'
})
export abstract class ApplicationService {
  public loginUrl: string = '';
  public myInfoUrl: string = '';
  public myInfoEditUrl: string = '';
  public myPasswordEditUrl: string = '';

  public LOGIN_COOKIE_NAME: string = '';

  public loginPageUrl: string = '';
  public homePageUrl: string = '';
  public menuUrl: string = '';
  public actionAclUrl: string = '';

  public demoPersonInfo: MyInfo | null = null;
  public demoLoginResponeseInfo: LoginResponseInfo | null = null;
  public demoMenuWithAclInfo: FunctionModel[] = [];
  public demoActionWithACLInfo: ActionAclInfo[] = [];

  private _myInfo$ = new BehaviorSubject<number | null>(null);
  public myInfo$ = this._myInfo$.asObservable().pipe(
    filter((params: number | null) => params !== null),
    switchMap((params: number | null) => {
      if (this.demoPersonInfo) {
        return of({ data: this.demoPersonInfo });
      }

      return this.http.get(this.myInfoUrl, { uid: params }).pipe(
        map((response: any) => {
          if (!response.meta.success) {
            this.message.error(response['meta']['message']);
          }
          return response;
        })
      );
    })
  );

  constructor(
    public http: _HttpClient,
    @Optional() public message: NzMessageService,
    public router: Router,
    public token: TokenService,
    public acl: ACLService,
    public cache: CacheService,
    public i18n: I18NService
  ) {}

  /**
   * 登录操作
   *
   * @returns Observable<any>
   */
  public login(loginInfo: LoginFormInfo, autoLogin = false): Observable<ResponseData> {
    let passwordEpt = loginInfo.password;
    if (!autoLogin) {
      passwordEpt = encryptForServer(loginInfo.password);
    }

    const login: Observable<ResponseData> = this.demoLoginResponeseInfo
      ? of({ meta: { success: true }, data: this.demoLoginResponeseInfo })
      : this.http.post(this.loginUrl, {
          account: loginInfo.account,
          password: passwordEpt
        });

    return login.pipe(
      map((response: ResponseData) => {
        if (!response.meta.success) {
          this.message.error(response.meta.message);
          return response;
        }
        if (loginInfo.autoLogin) {
          setCookie(
            this.LOGIN_COOKIE_NAME,
            btoa(
              JSON.stringify({
                account: loginInfo.account,
                password: passwordEpt
              })
            )
          );
        }
        this.token.set({
          uid: (response.data as ResponseContentData)['id'],
          token: (response.data as ResponseContentData)['token'] as string,
          longToken: (response.data as ResponseContentData)['longToken'] as string,
          time: new Date().getTime(),
          roleList: (response.data as ResponseContentData)['roleList'] as number[]
        });

        this.router.navigate([this.homePageUrl]);
        return response;
      })
    );
  }

  /**
   * 自动登录。可以在路由守卫中直接登录系统。
   */
  public autoLogin(): Observable<boolean> {
    const loginInfo = this.getLoginInfoFromCookie();
    if (!loginInfo) {
      this.router.navigate([this.loginPageUrl]);
      return of(false);
    }
    return this.login(loginInfo, true).pipe(
      map((response: ResponseData) => {
        if (!response.meta.success) {
          this.router.navigate([this.loginPageUrl]);
          return false;
        }
        return true;
      })
    );
  }

  /**
   *  登出
   */
  public logout() {
    this.token.clear();
    this.cache.clear();
    this.getACLInfo();
    this.router.navigate([this.loginPageUrl]);
  }

  /**
   * 判断是否已经登录过。
   *
   * @returns boolean
   */
  public isLogined(): boolean {
    return this.token.get() && this.token.get().token;
  }

  /**
   * 获取菜单信息
   */
  public getMenuData(): Observable<any> {
    if (!this.menuUrl) {
      return of(null);
    }

    this.acl.setAbility(this.token.get().roleList);
    const menu: Observable<ResponseData> =
      this.demoMenuWithAclInfo && this.demoMenuWithAclInfo.length > 0
        ? of({ meta: { success: true }, data: this.demoMenuWithAclInfo })
        : this.http.get(this.menuUrl);

    return menu.pipe(
      map((response: ResponseData) => {
        if (!response.meta.success) {
          this.message.error(response.meta.message);
          return null;
        }
        const menu: Menu[] = [
          ...buildTree<MyMenu>(response.data as FunctionModel[], (v: FunctionModel) => {
            return new MyMenu(v);
          })
        ];
        return menu;
      })
    );
  }

  /**
   * 获取各个画面的按钮的ACL信息
   */
  public getACLInfo(): Observable<any> {
    if (this.demoActionWithACLInfo && this.demoActionWithACLInfo.length > 0) {
      this.cache.set(this.actionAclUrl, {
        meta: { success: true },
        data: this.demoActionWithACLInfo
      });
    }
    if (!this.actionAclUrl) {
      return of(null);
    }

    return this.cache.get(this.actionAclUrl).pipe(
      map((response: any) => {
        if (!response?.meta?.success) {
          this.message.error(response.meta.message);
        }
        return response.data;
      })
    );
  }

  public getMyInfo() {
    if (this.token.get().uid) {
      this._myInfo$.next(this.token.get().uid);
    }
  }

  public editMyInfo(info: MyInfo): Observable<ResponseData> {
    return this.http.post(this.myInfoEditUrl, info).pipe(
      map((response: ResponseData) => {
        if (!response.meta.success) {
          this.message.error(response.meta.message);
        } else {
          this.message.success(this.i18n.fanyi('common.handle-ok'));
          this.getMyInfo();
        }
        return response;
      })
    );
  }

  // 修改密码
  public updateMyPassword(newPasswordInfo: { id: any; oldPassword: string; newPassword: string; newPwConfirm: string }): Observable<any> {
    const info = {
      id: newPasswordInfo.id,
      oldPassword: encryptForServer(newPasswordInfo.oldPassword),
      newPassword: encryptForServer(newPasswordInfo.newPassword),
      newPwConfirm: encryptForServer(newPasswordInfo.newPwConfirm)
    };

    return this.http.post(this.myPasswordEditUrl, info).pipe(
      map((response: ResponseData) => {
        if (response.meta.success) {
          this.message.success(this.i18n.fanyi('common.handle-ok'));
        } else {
          this.message.error(response.meta.message);
        }
        return response;
      })
    );
  }

  private getLoginInfoFromCookie(): LoginFormInfo | null {
    const loginCookie = getCookie(this.LOGIN_COOKIE_NAME);
    if (loginCookie && loginCookie.length > 0) {
      return JSON.parse(atob(loginCookie));
    }
    return null;
  }
}

export interface LoginFormInfo {
  account: string;
  password: string;
  autoLogin: boolean;
}

export interface LoginResponseInfo {
  id: number;
  token: string;
  longToken: string;
  roleList: number[];
}

export interface MyInfo {
  id: number;
  account?: string;
  name?: string;
  phone?: string;
  mail?: string;
  roleName?: string;
}

export interface ActionAclInfo {
  [key: string]: NzSafeAny;
  id?: number;
  text?: string;
  moduleType?: string;
  acl?: number[];
}
