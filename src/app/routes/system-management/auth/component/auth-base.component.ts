import { ViewContainerRef } from "@angular/core";
import { AuthViewModel } from "../view-model/auth-view-model";

export interface AuthBaseComponent {
  viewModel: AuthViewModel;
  childViewRef: ViewContainerRef;
}
