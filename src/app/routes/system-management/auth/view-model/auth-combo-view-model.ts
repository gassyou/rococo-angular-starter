import { Type } from '@angular/core';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

import { AuthBaseComponent } from '../component/auth-base.component';
import { AuthViewModel } from './auth-view-model';

export class AuthComboViewModel extends AuthViewModel {
  private children: AuthViewModel[] = [];

  constructor(public component: Type<AuthBaseComponent>, public data: FunctionModel) {
    super(component, data);
  }

  public add(component: AuthViewModel): void {
    component.rank = this.rank + 1;
    component.titleBackgroundColor = `hsl(${220 - component.rank * 8},${50 + component.rank * 10}%,${50 + component.rank * 2}%)`;
    this.children.push(component);
  }

  public getChildren(): AuthViewModel[] {
    return this.children;
  }
}
