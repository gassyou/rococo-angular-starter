import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { PassportComponent } from './layout/passport/passport.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'passport',
    component: PassportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
