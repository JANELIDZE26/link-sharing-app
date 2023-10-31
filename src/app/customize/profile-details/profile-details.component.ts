import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

enum FormControls {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  profileImage = 'profileImage',
}

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  private isEditMode: boolean = false;
  public profileDetailsForm!: FormGroup;

  // TODO unsubscribe
  public isSaveDisabled: boolean = true;

  get FormControls() {
    return FormControls;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // await fetch profile details

    // if profile details exist, put them in form if not create empty form group

    this.profileDetailsForm = this.buildEmptyForm();
  }

  onSave(): void {
    if (this.isSaveDisabled) return;

    // TODO update profile details
  }

  private buildEmptyForm(): FormGroup {
    return this.formBuilder.group({
      [FormControls.firstName]: ['', Validators.required],
      [FormControls.lastName]: ['', Validators.required],
      [FormControls.email]: ['', Validators.email],
      [FormControls.profileImage]: [
        '',
        {
          validators: Validators.required,
          asyncValidators: ['mimeTypeValidator'],
        },
      ],
    });
  }
}
