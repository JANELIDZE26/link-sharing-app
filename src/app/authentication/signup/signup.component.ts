import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Account } from 'src/models/interfaces/account';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  model: Account = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private api: AuthService) {}

  public onSignUp(): void {
    this.api.createUser(this.model.email, this.model.password);
  }
}
