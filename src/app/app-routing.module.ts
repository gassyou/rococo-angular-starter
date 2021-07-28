import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./routes/routes.module').then(m => m.RoutesModule) },
  { path: 'passport', loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule) },
  { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
  { path: '**', redirectTo: 'exception/404' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
