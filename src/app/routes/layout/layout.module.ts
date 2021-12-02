import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEModule } from '@delon/abc/se';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { SharedModule } from 'src/app/shared/shared.module';

import { MainComponent } from './main/main.component';
import { EditMyPasswordComponent } from './widgets/edit-my-password.component';
import { HeaderUserComponent } from './widgets/header-user.component';
import { MyInfoComponent } from './widgets/my-info.component';
@NgModule({
  declarations: [MainComponent, HeaderUserComponent, EditMyPasswordComponent, MyInfoComponent],
  imports: [CommonModule, LayoutDefaultModule, RouterModule, SharedModule, SEModule, ReactiveFormsModule]
})
export class LayoutModule {}
