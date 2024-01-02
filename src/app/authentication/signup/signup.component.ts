import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Account } from 'src/models/interfaces/account';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  userAlreadyExists: boolean = false;
  model: Account = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private api: AuthService,
    private changeDetection: ChangeDetectorRef,
    private hotToast: HotToastService
  ) {}

  ngOnInit(): void {
    this.hotToast.show("Don't Use Real Credentials!", {
      position: 'bottom-center',
      className: 'toastrClass warning',
    });
  }

  public onSignUp(): void {
    if (this.model.password !== this.model.confirmPassword) {
      return;
    }
    this.api
      .createUser(this.model.email, this.model.password)
      .catch((error) => {
        this.userAlreadyExists = true;
        this.changeDetection.detectChanges();
        console.error(error);
      });
  }
}
