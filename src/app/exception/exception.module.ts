import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExceptionNoAuthComponent } from './exception-no-auth.component';
import { ExceptionNotFoundComponent } from './exception-not-found.component';
import { ExceptionRoutingModule } from './exception-routing.module';

@NgModule({
  declarations: [ExceptionNoAuthComponent, ExceptionNotFoundComponent],
  imports: [CommonModule, ExceptionRoutingModule, SharedModule]
})
export class ExceptionModule {}
