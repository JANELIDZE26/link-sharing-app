import { Component } from '@angular/core';
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
}
