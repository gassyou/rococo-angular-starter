import { NgModule } from "@angular/core";

import { PassportRoutingModule } from "./passport-routing.module";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../core/core.module";
import { MyApplicationService } from "../core/service/my-application.service";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    PassportRoutingModule,
    CoreModule
  ],
  providers: [MyApplicationService]
})
export class PassportModule {}
