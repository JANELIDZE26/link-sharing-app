import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { CustomizeComponent } from './customize/customize.component';
import { NavComponent } from './nav/nav.component';
import { CustomizeLinksComponent } from './customize/customize-links/customize-links.component';
import { AddLinkComponent } from './customize/add-link/add-link.component';
import { DropdownComponent } from './customize/add-link/dropdown/dropdown.component';
import { PreviewComponent } from './preview/preview.component';
import { ProfileDetailsComponent } from './customize/profile-details/profile-details.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { HttpClientModule } from '@angular/common/http';
import { SafeHtmlPipePipe } from './pipes/safe-html-pipe.pipe';
import { SvgComponentComponent } from '../shared/components/svg-component/svg-component.component';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { SpinnerComponent } from 'src/shared/components/spinner/spinner.component';
import { SmartphoneViewComponent } from './customize/smartphone-view/smartphone-view.component';
import { ShrinkString } from './pipes/shrink-string.pipe';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
    CustomizeComponent,
    CustomizeLinksComponent,
    ProfileDetailsComponent,
    NavComponent,
    AddLinkComponent,
    DropdownComponent,
    PreviewComponent,
    DragAndDropDirective,
    SafeHtmlPipePipe,
    SvgComponentComponent,
    SpinnerComponent,
    SmartphoneViewComponent,
    ShrinkString,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NgxSmartModalModule.forRoot(),
    HttpClientModule,
  ],
  providers: [provideHotToastConfig({})],
  bootstrap: [AppComponent],
})
export class AppModule {}
