import { Type } from "@angular/core";
import { FunctionModel } from "src/app/routes/system-management/auth/entity/function-model";
import { AuthBaseComponent } from "../component/auth-base.component";
import { AuthViewModel } from "./auth-view-model";

export class AuthItemViewModel extends AuthViewModel {
  constructor(
    public component: Type<AuthBaseComponent>,
    public data: FunctionModel
  ) {
    super(component, data);
  }

  public add(component: AuthViewModel): void {
    return;
  }
  public getChildren(): AuthViewModel[] {
    return [];
  }
}
