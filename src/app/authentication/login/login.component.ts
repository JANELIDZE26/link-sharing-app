import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Account } from 'src/models/interfaces/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  model: Account = {
    email: '',
    password: '',
  };

  constructor(private api: AuthService) {}

  public onLogin(): void {
    this.api.signIn(this.model.email, this.model.password);
  }
}
