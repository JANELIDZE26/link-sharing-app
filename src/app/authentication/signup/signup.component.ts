import { Component } from '@angular/core';
import { Account } from 'src/models/account';

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

  constructor() {}

  public onSignUp(): void {
  }
}
