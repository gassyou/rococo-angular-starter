import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CRUDService } from '../../../freamwork/core/crud.service';
import { I18NService } from '../i18n.service';
import { RoleService } from './role.service';

@Injectable()
export class UserService extends CRUDService {

  demoDataSource: any[] = [];
  constructor(http: _HttpClient, @Optional() message: NzMessageService, @Inject(ALAIN_I18N_TOKEN) i18n: I18NService) {
    super(http, message, i18n);

    super.searchUrl = 'sys-user/search';
    super.addUrl = 'sys-user/add';
    super.deleteUrl = 'sys-user/delete';
    super.updateUrl = 'sys-user/update';

    this.demoDataSource = [];
    for (let i = 0; i < 100; i++) {
      this.demoDataSource.push({
        name: `张三${i}`,
        account: i,
        roleName: `管理员${i}`,
        mail: `mail${i}@example.com`,
        lastLoginTime: new Date(),
        lastLoginIp: `0.0.0.0`
      });
    }
  }

  public updatePassword(data: any): Observable<any> {
    return this.http.post('/sys-user/update-password', data).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
          return response;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  public enableAccount(data: any): Observable<any> {
    return this.http.post('/sys-user/enable', data).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
          this.search();
          return response.data;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class RoleResolveService  {
  constructor(private service: RoleService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.service.all();
  }
}
