import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export const ratioValidator = (
  formControl: AbstractControl
): Observable<any> => {
  const file = formControl.value;

  return new Observable((subscriber) => {
    const image = new Image();
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      if (width !== 1024 && height !== 1024) {
        subscriber.next({
          validationError: 'Image must have 1024x1024 pixel ratio',
        });
      } else {
        subscriber.next(null);
      }

      subscriber.complete();
    };

    image.src = URL.createObjectURL(file);
  });
};
