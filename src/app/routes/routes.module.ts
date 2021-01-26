import { RoutesRoutingModule } from './routes-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { MenuService } from '@delon/theme';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    LayoutModule,

  ],
  providers: [MenuService]
})
export class RoutesModule { }
