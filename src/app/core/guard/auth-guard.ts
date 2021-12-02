import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '@delon/auth';
import { Menu, MenuService } from '@delon/theme';
import { Observable, of } from 'rxjs';

import { MyApplicationService } from '../service/my-application.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private myApp: MyApplicationService, private token: TokenService, private menu: MenuService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.log(this.token.get());
    // console.log(this.menu.menus);

    // console.log(state.url);
    // console.log(this.menu.getPathByUrl(state.url));

    if (!this.myApp.isLogined()) {
      return this.myApp.autoLogin();
    } else {
      return of(true);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  // canActivateUrl(url): Observable<boolean> {

  //   const menuItems = this.menu.getPathByUrl(url);

  //   for(let menu of menuItems) {

  //     if(menu.acl && ) {
  //       return of(false);
  //     }
  //   }

  //   return of(true);
  // }
}
