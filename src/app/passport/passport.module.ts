import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AlainThemeModule } from '@delon/theme';

import { CoreModule } from '../core/core.module';
import { MyApplicationService } from '../core/service/my-application.service';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PassportRoutingModule } from './passport-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, ReactiveFormsModule, PassportRoutingModule, CoreModule, AlainThemeModule.forChild()],
  providers: [MyApplicationService]
})
export class PassportModule {}
