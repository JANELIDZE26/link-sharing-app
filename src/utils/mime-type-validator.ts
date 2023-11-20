import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

export const mimeTypeValidator = (
  formControl: AbstractControl
): Observable<any> => {
  if (typeof formControl.value === 'string') return of(null);
  const file = formControl.value as File;

  return new Observable(function validateFile(subscriber) {
    const fileReader = new FileReader();
    fileReader.onloadend = (result) => {
      const uintArray = new Uint8Array(result.target!.result as ArrayBuffer);

      const str = uintArray.reduce((str, byte) => str + byte.toString(16), '');
      const mimeTypes = ['89504e', 'ffd8ff'];

      if (mimeTypes.includes(str)) {
        subscriber.next(null);
      } else {
        subscriber.next({
          validationError: 'Incorrect File Type (Only jpg, jpeg, png Allowed)',
        });
      }

      subscriber.complete();
    };
    fileReader.readAsArrayBuffer(file.slice(0, 3));
  });
};
