import { Inject, Injectable } from '@angular/core';
import { ALAIN_I18N_TOKEN, Menu, MenuService } from '@delon/theme';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { I18NService } from './i18n.service';
import { MyApplicationService } from './my-application.service';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(private menuService: MenuService, private myApp: MyApplicationService, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService) {}

  load(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;
    return zip(this.i18n.loadLangData(defaultLang), this.myApp.getACLInfo(), this.myApp.getMenuData()).pipe(
      map(([langData, aclInfo, menu]: any[]) => {
        if (menu) {
          this.i18n.use(defaultLang, langData);
          this.menuService.add(menu);
        }
      })
    );
  }
}
