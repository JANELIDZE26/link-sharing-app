import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';

@Injectable({
  providedIn: 'root',
})
export class ProfileDetailsService {
  private _profileDetails$ = new BehaviorSubject<ProfileDetails | null>(null);
  private _imageUrl$ = new Subject<string | ArrayBuffer | null | undefined>();

  get profileDetails$(): Observable<ProfileDetails | null> {
    return this._profileDetails$.asObservable();
  }

  get imageUrl$(): Observable<string | ArrayBuffer | null | undefined> {
    return this._imageUrl$.asObservable();
  }

  constructor(private profileDetails: ApiService) {}

  public setProfileDetails(profileDetails: ProfileDetails) {
    this._profileDetails$.next(profileDetails);
  }

  public setImageUrl(imageUrl: string | ArrayBuffer | null | undefined) {
    this._imageUrl$.next(imageUrl);
  }
}
