import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { getCookie, setCookie } from '../util/cookie-util';
import { encryptForServer } from '../util/crypto';
import { ResponseData, ResponseContentData } from './response-data';

@Injectable({
  providedIn: 'root'
})
export abstract class ApplicationService {
  public abstract loginUrl: string;
  public abstract myInfoUrl: string;
  public abstract myInfoEditUrl: string;
  public abstract myPasswordEditUrl: string;

  public abstract LOGIN_COOKIE_NAME: string;

  public abstract loginPageUrl: string;
  public abstract homePageUrl: string;
  public abstract appName: string;
  public abstract menuUrl: string;
  public abstract actionAclUrl: string;

  private _myInfo$ = new BehaviorSubject<number | null>(null);
  public myInfo$ = this._myInfo$.asObservable().pipe(
    filter((params: number | null) => params !== null),
    switchMap((params: number | null) => {
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
    public cache: CacheService
  ) {}

  /**
   * 登录操作
   *
   * @returns Observable<any>
   */
  public login(loginInfo: LoginInfo, autoLogin = false): Observable<ResponseData> {
    if (environment.demo) {
      this.token.set({
        uid: '0001',
        token: 'test001',
        longToken: 'test001',
        time: new Date().getTime(),
        roleList: ['1']
      });
      this.router.navigate([this.homePageUrl]);
      return of();
    }

    let passwordEpt = loginInfo.password;
    if (!autoLogin) {
      passwordEpt = encryptForServer(loginInfo.password);
    }

    return this.http
      .post(this.loginUrl, {
        account: loginInfo.account,
        password: passwordEpt
      })
      .pipe(
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
            roleList: (response.data as ResponseContentData)['roleList'] as string[]
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
    if (environment.demo) {
      return of([
        {
          text: '设定',
          group: true,
          acl: ['1'],
          children: [
            {
              text: '用户管理',
              link: '/sys/user',
              group: false,
              acl: ['1']
            },
            {
              text: '角色管理',
              link: '/sys/role',
              group: false,
              acl: ['1']
            }
          ]
        }
      ]);
    }
    if (!this.menuUrl) {
      return of(null);
    }

    this.acl.setRole(this.token.get().roleList);
    return this.http.get(this.menuUrl).pipe(
      map((response: ResponseData) => {
        if (!response.meta.success) {
          this.message.error(response.meta.message);
          return null;
        }
        return response.data;
      })
    );
  }

  /**
   * 获取各个画面的按钮的ACL信息
   */
  public getACLInfo(): Observable<any[] | null> {
    if (environment.demo) {
      return of(['1']);
    }
    if (!this.actionAclUrl) {
      return of(null);
    }

    return this.cache.get(this.actionAclUrl).pipe(
      map((response: any) => {
        if (!response.meta.success) {
          this.message.error(response.meta.message);
        }
        return response.data as any[];
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
          this.message.success('個人情報を成功に更新しました');
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
          this.message.success('パスワードが成功に変更しました。');
        } else {
          this.message.error(response.meta.message);
        }
        return response;
      })
    );
  }

  private getLoginInfoFromCookie(): LoginInfo | null {
    const loginCookie = getCookie(this.LOGIN_COOKIE_NAME);
    if (loginCookie && loginCookie.length > 0) {
      return JSON.parse(atob(loginCookie));
    }
    return null;
  }
}

export interface LoginInfo {
  account: string;
  password: string;
  autoLogin: boolean;
}

export interface MyInfo {
  id: number;
  account?: string;
  name: string;
  phone: string;
  roleName?: string;
}
