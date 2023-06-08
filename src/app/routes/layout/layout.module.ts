import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEModule } from '@delon/abc/se';
import { AlainThemeModule } from '@delon/theme';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { UserService } from 'src/app/core/service/core/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { MainComponent } from './main/main.component';
import { EditMyPasswordComponent } from './widgets/edit-my-password.component';
import { HeaderUserComponent } from './widgets/header-user.component';
import { MyInfoComponent } from './widgets/my-info.component';
@NgModule({
    imports: [CommonModule, LayoutDefaultModule, RouterModule, SharedModule, SEModule, ReactiveFormsModule, AlainThemeModule.forChild(), MainComponent, HeaderUserComponent, EditMyPasswordComponent, MyInfoComponent],
    providers: [UserService]
})
export class LayoutModule {}
