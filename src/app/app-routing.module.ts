import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guard/auth-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routes/routes.module').then(m => m.RoutesModule),
    canActivateChild: [AuthGuard]
  },
  { path: 'passport', loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule) },
  { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
  { path: '**', redirectTo: 'exception/404' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
