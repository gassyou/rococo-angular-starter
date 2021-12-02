import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { SharedModule } from 'src/app/shared/shared.module';

import { MainComponent } from './main/main.component';
import { HeaderUserComponent } from './widgets/header-user.component';
@NgModule({
  declarations: [MainComponent, HeaderUserComponent],
  imports: [CommonModule, LayoutDefaultModule, RouterModule, SharedModule]
})
export class LayoutModule {}
