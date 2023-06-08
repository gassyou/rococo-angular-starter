import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlainThemeModule } from '@delon/theme';

import { SharedModule } from '../shared/shared.module';
import { ExceptionNoAuthComponent } from './exception-no-auth.component';
import { ExceptionNotFoundComponent } from './exception-not-found.component';
import { ExceptionRoutingModule } from './exception-routing.module';

@NgModule({
    imports: [CommonModule, ExceptionRoutingModule, SharedModule, AlainThemeModule.forChild(), ExceptionNoAuthComponent, ExceptionNotFoundComponent]
})
export class ExceptionModule {}
