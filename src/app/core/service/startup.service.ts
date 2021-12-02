import { Injectable } from '@angular/core';
import { Menu, MenuService } from '@delon/theme';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { MyApplicationService } from './my-application.service';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(private menuService: MenuService, private myApp: MyApplicationService) {}

  load(): Observable<void> {
    return zip(this.myApp.getACLInfo(), this.myApp.getMenuData()).pipe(
      map(([aclInfo, menu]: [any[], Menu[]]) => {
        if (menu) {
          this.menuService.add(menu);
        }
      })
    );
  }
}
