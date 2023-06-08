import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/core/service/core/auth.service';
import { RoleService } from 'src/app/core/service/core/role.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { AuthActionEditComponent } from './component/auth-action-edit.componet';
import { AuthActionComponent } from './component/auth-action.component';
import { AuthHostDirective } from './component/auth-host.directive';
import { AuthModuleEditComponent } from './component/auth-module-edit.component';
import { AuthModuleComponent } from './component/auth-module.component';
import { AuthPageEditComponent } from './component/auth-page-edit.component';
import { AuthTabEditComponent } from './component/auth-tab-edit.componet';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ZORRO_MODULES,
        DelonFormModule,
        AlainThemeModule.forChild(),
        DelonACLModule,
        AuthComponent,
        AuthModuleComponent,
        AuthHostDirective,
        AuthActionComponent,
        AuthPageEditComponent,
        AuthModuleEditComponent,
        AuthTabEditComponent,
        AuthActionEditComponent
    ],
    providers: [
        NzModalService,
        NzMessageService,
        AuthService,
        { provide: CRUDService, useExisting: AuthService },
        RoleService,
        AuthHostDirective
    ]
})
export class AuthModule {}
