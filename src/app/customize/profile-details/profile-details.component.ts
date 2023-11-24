import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageValidation } from 'src/models/enums/image-validation';
import { imageValidators } from 'src/utils/image-validators/combined-validators';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';

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
  public profileDetailsForm!: FormGroup;
  public imageUrl: string | ArrayBuffer | null | undefined;
  public isDragOver: boolean = false;
  public isSaveDisabled: boolean = true;
  public isEditMode: boolean = false;
  public showSpinner: boolean = false;

  get FormControls() {
    return FormControls;
  }

  get IMAGE_VALIDATION() {
    return ImageValidation;
  }

  get isFormValid(): boolean {
    return this.profileDetailsForm.valid;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}

  public getImageValidator(validatorType: ImageValidation): number | null {
    const result =
      this.profileDetailsForm.controls[FormControls.profileImage].errors?.[
        validatorType
      ];
    return result;
  }

  public ngOnInit() {
    this.showSpinner = true;
    // await fetch profile details
    this.apiService.getProfileDetails().subscribe(
      ([image, userProfile]) => {
        this.imageUrl = image;
        this.profileDetailsForm.patchValue(userProfile as ProfileDetails);

        if (userProfile) {
          this.isEditMode = true;
        }
      },
      null,
      () => {
        this.showSpinner = false;
      }
    );

    // if profile details exist, put them in form if not create empty form group

    this.profileDetailsForm = this.buildEmptyForm();
  }

  public onSave(): void {
    if (!this.isFormValid) return;
    if (this.isEditMode) {
      this.apiService.editProfileDetails(this.profileDetailsForm.value);
    } else {
      this.apiService.saveProfileDetails(this.profileDetailsForm.value);
    }
  }

  public onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    this.patchImage(file);
  }

  public patchImage(file: File): void {
    const fs = new FileReader();
    this.profileDetailsForm.patchValue({
      [FormControls.profileImage]: file,
    });

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
          asyncValidators: [imageValidators],
        },
      ],
    });
  }
}
