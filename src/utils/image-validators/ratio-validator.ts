import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImageValidation } from 'src/models/enums/image-validation';

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
          [ImageValidation.pixelsRatioError]: ImageValidation.pixelsRatioError,
        });
      } else {
        subscriber.next(null);
      }

      subscriber.complete();
    };

    image.src = URL.createObjectURL(file);
  });
};
