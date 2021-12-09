import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from './layout/layout.module';
import { RoutesRoutingModule } from './routes-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RoutesRoutingModule, LayoutModule, SharedModule, FormsModule]
})
export class RoutesModule {}
