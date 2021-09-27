import { Injectable, Optional } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { setCookie } from '../util/cookie-util';
import { ResponseData } from './response-data';

@Injectable()
export class ApplicationService {
  public loginUrl: string = '';
  public myInfoUrl: string = '';
  public myInfoEditUrl: string = '';
  public myPasswordEditUrl: string = '';
  public LOGIN_COOKIE_NAME = '';

  public afterLoginSuccess: (response: ResponseData) => void;
  public afterLoginFailure: (response: ResponseData) => void;

  constructor(public http: _HttpClient, @Optional() public message: NzMessageService) {}

  /**
   * 登录操作
   *
   * @returns Observable<any>
   */
  public login(loginInfo: LoginInfo) {
    return this.http.post(this.loginUrl, loginInfo).subscribe((response: ResponseData) => {
      if (response.meta.success) {
        setCookie(this.LOGIN_COOKIE_NAME, btoa(JSON.stringify(loginInfo)));
        if (this.afterLoginSuccess) {
          this.afterLoginSuccess(response);
        }
      } else {
        if (this.afterLoginFailure) {
          this.afterLoginFailure(response);
        }
      }
      return response;
    });
  }
}

export interface LoginInfo {
  account: string;
  password: string;
}
