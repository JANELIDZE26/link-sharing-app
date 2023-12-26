import { CustomizeComponent } from './customize/customize.component';
import { LoginComponent } from './authentication/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './authentication/signup/signup.component';
import { PreviewComponent } from './preview/preview.component';
import { CustomizeLinksComponent } from './customize/customize-links/customize-links.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authGuard } from './authentication/auth.guard';
import { ProfileDetailsComponent } from './customize/profile-details/profile-details.component';
import { previewGuard } from './preview/preview.guard';

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
    path: 'customize',
    component: CustomizeComponent,
    children: [
      { path: '', redirectTo: 'links', pathMatch: 'full' },
      {
        path: 'links',
        canActivate: [authGuard],
        component: CustomizeLinksComponent,
      },
      {
        path: 'profile-details',
        canActivate: [authGuard],
        component: ProfileDetailsComponent,
      },
    ],
  },
  {
    path: 'preview',
    canActivate: [authGuard, previewGuard],
    component: PreviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
