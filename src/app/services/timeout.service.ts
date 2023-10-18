import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  private instance: any;
  constructor() {}

  set(time: number, callback: (args?: any) => void) {
    this.instance = setTimeout(callback, time);
  }

  clear(): void {
    clearTimeout(this.instance);
  }
}
