import { AbstractControl } from '@angular/forms';
import { of, switchMap } from 'rxjs';
import { mimeTypeValidator } from './mime-type-validator';
import { ratioValidator } from './ratio-validator';

export const imageValidators = (control: AbstractControl) => {
  if (!control.value) return of(null);
  return mimeTypeValidator(control).pipe(
    switchMap((errors) => {
      if (errors) return of(errors);
      return ratioValidator(control);
    })
  );
};
