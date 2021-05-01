import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/list/user.component';

const routes: Routes = [
  { path: 'user',         component: UserComponent,},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysMgtRoutingModule { }
