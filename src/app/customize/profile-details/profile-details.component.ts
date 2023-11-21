import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageValidation } from 'src/models/enums/image-validation';
import { imageValidators } from 'src/utils/image-validators/combined-validators';
import { mimeTypeValidator } from 'src/utils/image-validators/mime-type-validator';
import { ratioValidator } from 'src/utils/image-validators/ratio-validator';

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
  public imageUrl: string | ArrayBuffer | null | undefined;
  public isDragOver: boolean = false;

  // TODO unsubscribe
  public isSaveDisabled: boolean = true;

  get FormControls() {
    return FormControls;
  }

  get IMAGE_VALIDATION() {
    return ImageValidation;
  }

  get isFormValid(): boolean {
    return this.profileDetailsForm.valid;
  }

  constructor(private formBuilder: FormBuilder) {}

  public getImageValidator(validatorType: ImageValidation): number | null {
    const result =
      this.profileDetailsForm.controls[FormControls.profileImage].errors?.[
        validatorType
      ];
    return result;
  }

  public ngOnInit(): void {
    // await fetch profile details

    // if profile details exist, put them in form if not create empty form group

    this.profileDetailsForm = this.buildEmptyForm();
  }

  public onSave(): void {
    if (!this.isFormValid) return;
    console.log(this.profileDetailsForm.value);
    // TODO update profile details
  }

  public onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    this.patchImage(file);
  }

  public patchImage(file: File): void {
    this.profileDetailsForm.patchValue({ [FormControls.profileImage]: file });

    const fs = new FileReader();

    if (file) {
      fs.onload = (event) => {
        this.imageUrl = event.target!.result;
      };
      fs.readAsDataURL(file);
    } else {
      console.error('Error Occured during image upload');
    }
  }

  private buildEmptyForm(): FormGroup {
    return this.formBuilder.group({
      [FormControls.firstName]: ['', Validators.required],
      [FormControls.lastName]: ['', Validators.required],
      [FormControls.email]: [
        '',
        { validators: [Validators.email, Validators.required] },
      ],
      [FormControls.profileImage]: [
        null,
        {
          validators: Validators.required,
          asyncValidators: [imageValidators],
        },
      ],
    });
  }
}
