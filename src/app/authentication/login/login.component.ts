import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Account } from 'src/models/interfaces/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  invalidCredentials: boolean = false;
  model: Account = {
    email: '',
    password: '',
  };

  constructor(private api: AuthService, private changeDetection: ChangeDetectorRef) {}

  public onLogin(): void {
    this.api.signIn(this.model.email, this.model.password).catch((error) => {
      console.error(error);
      this.invalidCredentials = true;
      this.changeDetection.detectChanges();
    });
  }
}
