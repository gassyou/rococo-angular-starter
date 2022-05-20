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
      if (environment.demo) {
        return of({
          data: {
            id: '0001',
            account: 'admin',
            name: '测试用户',
            phone: '13000000000',
            roleName: '配置管理员'
          }
        });
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
          text: 'ESG系统',
          link: '/front/home',
          group: false,
          hideInBreadcrumb: true,
          hide: false,
          acl: ['1'],
          reuse: false,
          children: [
            {
              text: '首页',
              link: '/front/home',
              group: false,
              icon: 'anticon anticon-home',
              acl: ['1']
            },
            {
              text: '资讯列表',
              group: false,
              hide: true,
              link: '/front/news-list',
              acl: ['1']
            },
            {
              text: '通告列表',
              group: false,
              hide: true,
              link: '/front/info-list',
              acl: ['1']
            },
            {
              text: '常见问题列表',
              group: false,
              hide: true,
              link: '/front/question-list',
              acl: ['1']
            },
            {
              text: '新闻详情',
              group: false,
              hide: true,
              link: '/front/news',
              acl: ['1']
            },
            {
              text: '基础配置',
              group: false,
              icon: 'anticon anticon-appstore-add',
              acl: ['1'],
              children: [
                {
                  text: '范畴管理',
                  link: '/basic/category',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '组织管理',
                  link: '/basic/organization',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '议题管理',
                  link: '/basic/subject-management',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '系数管理',
                  link: '/basic/coefficient',
                  group: false,
                  acl: ['1']
                }
              ]
            },
            {
              text: '进度管理',
              group: false,
              icon: 'anticon anticon-import',
              acl: ['1'],
              children: [
                {
                  text: '填报进度',
                  link: '/setting/task-progress',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '指标进度',
                  link: '/setting/target-progress',
                  group: false,
                  acl: ['1']
                },
              ]
            },
            {
              text: '配置管理',
              group: false,
              icon: 'anticon anticon-control',
              acl: ['1'],
              children: [
                {
                  text: '指标规则',
                  link: '/setting/rule',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '指标属性',
                  link: '/setting/attribute',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '填报任务',
                  link: '/setting/task-fill',
                  group: false,
                  acl: ['1']
                }
              ]
            },
            {
              text: '填报管理',
              group: false,
              icon: 'anticon anticon-file-done',
              acl: ['1'],
              children: [
                {
                  text: '指标字典',
                  link: '/fill/dictionary'
                },
                {
                  text: '待我填报',
                  link: '/fill/add',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '填报历史',
                  link: '/fill/history',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '待填报任务',
                  hide: true,
                  link: '/fill/wait',
                  group: false,
                  acl: ['1']
                }
              ]
            },
            {
              text: 'ESG看板',
              link: '/esg',
              icon: 'anticon anticon-dashboard',
              group: false,
              acl: ['1']
            },
            {
              text: '分析报告',
              group: false,
              icon: 'anticon anticon-line-chart',
              acl: ['1'],
              children: [
                {
                  text: '填报数据',
                  link: '/analysis/fill-data',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '报告数据',
                  link: '/analysis/report-data',
                  group: false,
                  acl: ['1']
                }
              ]
            },
            {
              text: '内容管理',
              group: false,
              icon: 'anticon anticon-share-alt',
              acl: ['1'],
              children: [
                {
                  text: '新闻资讯',
                  link: '/content/news',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '最新通告',
                  link: '/content/annunciate',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '问题帮助',
                  link: '/content/question',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '投资人回应',
                  link: '/content/respond',
                  group: false,
                  acl: ['1']
                }
              ]
            },
            {
              text: '系统设置',
              group: false,
              icon: 'anticon anticon-setting',
              acl: ['1'],
              children: [
                {
                  text: '用户管理',
                  link: '/sys/user',
                  group: false,
                  acl: ['1']
                },
                {
                  text: '权限设置',
                  link: '/sys/auth',
                  group: false,
                  acl: ['1']
                }
              ]
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
