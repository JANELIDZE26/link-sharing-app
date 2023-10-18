import { LoginComponent } from './authentication/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './authentication/signup/signup.component';
import { PreviewComponent } from './preview/preview.component';
import { CustomizeLinksComponent } from './customize-links/customize-links.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthenticationComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  {
    path: 'customize-links',
    component: CustomizeLinksComponent,
    canActivate: [authGuard],
  },
  { path: 'preview', component: PreviewComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
