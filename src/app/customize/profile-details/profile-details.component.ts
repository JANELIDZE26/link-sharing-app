import { ApiService } from 'src/app/services/api/api.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageValidation } from 'src/models/enums/image-validation';
import { imageValidators } from 'src/utils/image-validators/combined-validators';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { ProfileDetailsService } from 'src/app/services/profile-details/profile-details.service';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { SpinnerState } from 'src/models/enums/spinners';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  public profileDetailsForm!: FormGroup;
  public imageUrl: string | ArrayBuffer | null | undefined;
  public isDragOver: boolean = false;
  public isSaveDisabled: boolean = true;
  private unsubscribes$ = new Subject<void>();

  get FormControls() {
    return FormControls;
  }

  get IMAGE_VALIDATION() {
    return ImageValidation;
  }

  get isFormValid(): boolean {
    return this.profileDetailsForm.valid;
  }

  get isEditMode() {
    return !!this.profileDetailsService.profileDetailsDocumentId;
  }

  get showImageSpinner(): boolean {
    return this.spinnerService.getSpinnerState(SpinnerState.imageUrl);
  }

  get showProfileDetailsSpinner(): boolean {
    return this.spinnerService.getSpinnerState(SpinnerState.imageUrl);
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private profileDetailsService: ProfileDetailsService,
    private changeDetector: ChangeDetectorRef,
    private spinnerService: SpinnerService
  ) {}

  public getImageValidator(validatorType: ImageValidation): number | null {
    const result =
      this.profileDetailsForm.controls[FormControls.profileImage].errors?.[
        validatorType
      ];
    return result;
  }

  public ngOnInit() {
    this.profileDetailsForm = this.buildEmptyForm();
    this.profileDetailsService.profileDetails$
      .pipe(takeUntil(this.unsubscribes$), take(2))
      .subscribe((userProfile) => {
        this.profileDetailsForm.patchValue(userProfile as ProfileDetails);
        this.changeDetector.detectChanges();
      });

    this.profileDetailsService.imageUrl$
      .pipe(
        takeUntil(this.unsubscribes$),
        filter((image) => !!image)
      )
      .subscribe((image) => {
        this.imageUrl = image;
        this.changeDetector.detectChanges();
      });

    this.profileDetailsForm.valueChanges
      .pipe(takeUntil(this.unsubscribes$))
      .subscribe((userProfile) => {
        this.profileDetailsService.setProfileDetails(
          userProfile as ProfileDetails
        );
      });

    this.profileDetailsForm.statusChanges
      .pipe(takeUntil(this.unsubscribes$))
      .subscribe(() => {
        this.changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribes$.next();
    this.unsubscribes$.complete();
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

    if (file) {
      fs.onload = (event) => {
        this.imageUrl = event.target!.result;
        this.profileDetailsService.setImageUrl(this.imageUrl);
        this.profileDetailsForm.patchValue({
          [FormControls.profileImage]: file,
        });
        this.changeDetector.detectChanges();
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
