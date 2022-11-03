import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExceptionNoAuthComponent } from './exception-no-auth.component';
import { ExceptionNotFoundComponent } from './exception-not-found.component';

const routes: Routes = [
  { path: '403', component: ExceptionNoAuthComponent },
  { path: '404', component: ExceptionNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionRoutingModule {}
