import { AuthModuleEditComponent } from "./component/auth-module-edit.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DelonFormModule } from "@delon/form";
import { AlainThemeModule } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { AuthService } from "src/app/core/service/core/auth.service";
import { RoleService } from "src/app/core/service/core/role.service";
import { CRUDService } from "src/app/freamwork/core/crud.service";
import { SharedModule } from "src/app/shared/shared.module";
import { ZORRO_MODULES } from "src/app/shared/zorro.module";

import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";
import { AuthActionComponent } from "./component/auth-action.component";
import { AuthHostDirective } from "./component/auth-host.directive";
import { AuthModuleComponent } from "./component/auth-module.component";
import { AuthPageEditComponent } from "./component/auth-page-edit.component";
import { AuthActionEditComponent } from "./component/auth-action-edit.componet";
import { AuthTabEditComponent } from "./component/auth-tab-edit.componet";
import { DelonACLModule } from "@delon/acl";

@NgModule({
  declarations: [
    AuthComponent,
    AuthModuleComponent,
    AuthHostDirective,
    AuthActionComponent,
    AuthPageEditComponent,
    AuthModuleEditComponent,
    AuthTabEditComponent,
    AuthActionEditComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ZORRO_MODULES,
    DelonFormModule,
    AlainThemeModule.forChild(),
    DelonACLModule
  ],
  providers: [
    NzModalService,
    NzMessageService,
    AuthService,
    { provide: CRUDService, useExisting: AuthService },
    RoleService,
    AuthHostDirective,
  ],
})
export class AuthModule {}
