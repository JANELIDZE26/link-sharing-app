import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/api/auth.service';
import { Account } from 'src/models/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
