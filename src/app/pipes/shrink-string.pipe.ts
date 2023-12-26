import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shrinkString',
})
export class ShrinkString implements PipeTransform {
  transform(
    value: string,
    length: number,
    addWhiteSpaceInBetween: boolean,
    ...additionalStrings: string[]
  ): string {
    let fullString = value;

    if (additionalStrings.length) {
      if (addWhiteSpaceInBetween) {
        additionalStrings.forEach((additionalString) => {
          fullString += ` ${additionalString}`;
        });
      } else {
        additionalStrings.forEach((additionalString) => {
          fullString += additionalString;
        });
      }
    }

    if (fullString.length > length) {
      return fullString.substring(0, length) + '...';
    }

    return fullString;
  }
}
