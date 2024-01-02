import { Injectable } from '@angular/core';
import { SpinnerState } from 'src/models/enums/spinners';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinners: { [key: string]: boolean } = {};

  static SPINNER_STATE: any;

  setSpinnerState(state: { [key: string]: boolean }) {
    Object.entries(state).forEach(([key, value]) => {
      this.spinners[key] = value;
    });
  }

  getSpinnerState(key: SpinnerState) {
    return this.spinners[key];
  }
}
