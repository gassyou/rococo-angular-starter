import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '@delon/auth';
import { MenuService } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MyApplicationService } from '../service/my-application.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private myApp: MyApplicationService, private token: TokenService, private menu: MenuService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (environment.demo) {
      return true;
    }
    if (!this.myApp.isLogined()) {
      return this.myApp.autoLogin().pipe(
        switchMap((data: any) => {
          if (!data) {
            this.router.navigate([this.myApp.loginPageUrl]);
            return of(false);
          } else {
            return this.canActivateUrl(state);
          }
        })
      );
    } else {
      return this.canActivateUrl(state);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  canActivateUrl(state: RouterStateSnapshot): Observable<boolean> {
    let url = state.url;
    if (url.indexOf('?')) {
      url = url.split('?')[0];
    }
    if (url.indexOf(';')) {
      url = url.split(';')[0];
    }
    const menuItems = this.menu.getPathByUrl(url);
    const roleList = this.token.get().roleList;
    for (let menu of menuItems) {
      if (!menu.acl || (menu.acl as string[]).length <= 0) {
        this.router.navigate(['/exception/403']);
        return of(false);
      }
      for (let role of roleList) {
        if ((menu.acl as string[]).includes(role)) {
          return of(true);
        }
      }
    }
    this.router.navigate(['/exception/403']);
    return of(false);
  }
}
