import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FirebaseLinks } from 'src/models/interfaces/firebaseUser';
import { AuthService } from '../auth/auth.service';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  merge,
  of,
  tap,
} from 'rxjs';
import { Link } from 'src/models/interfaces/link';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO implement spinners for api events.

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private auth: AuthService
  ) {}

  public addLinks(links: FirebaseLinks): void {
    const collection = this.firestore.collection('links');
    collection
      .add(links)
      .then(() => {
        this.router.navigateByUrl('customize/profile-details');
      })
      .catch((error) => console.error(error));
  }

  public editLinks(links: FirebaseLinks) {
    const collection = this.firestore.collection('links', (ref) =>
      ref.where('userId', '==', this.auth.userId)
    );
    collection
      .get()
      .forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Update the document with the new data
          collection.doc(doc.id).update(links);
        });
      })
      .then(() => {
        this.router.navigateByUrl('customize/profile-details');
      });
  }

  public getLinks(): Observable<Map<string, Link>> {
    return this.firestore
      .collection('links', (ref) => ref.where('userId', '==', this.auth.userId))
      .get()
      .pipe(
        map((result) => {
          const links: FirebaseLinks = result.docs.map((doc) =>
            doc.data()
          )[0] as FirebaseLinks;
          if (!links) return new Map();
          return new Map<string, Link>(Object.entries(links.links).sort());
        })
      );
  }

  public saveProfileDetails(profileDetails: ProfileDetails): void {
    const { profileImage, ...profileDetailsForm } = profileDetails;

    if (profileImage) {
      this.uploadImage(profileImage);
    }

    const collection = this.firestore.collection('profile-details');

    collection
      .add({ ...profileDetailsForm, userId: this.auth.userId })
      .then(() => {
        this.router.navigateByUrl('preview');
      })
      .catch((error) => console.error(error));
  }

  public editProfileDetails(profileDetails: ProfileDetails): void {
    const { profileImage, ...profileDetailsForm } = profileDetails;

    if (profileImage) {
      this.uploadImage(profileImage);
    }
    const collection = this.firestore.collection('profile-details', (ref) =>
      ref.where('userId', '==', this.auth.userId)
    );
    collection
      .get()
      .forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          collection.doc(doc.id).update(profileDetailsForm);
        });
      })
      .then(() => {
        this.router.navigateByUrl('preview');
      });
  }

  public getProfileDetails() {
    const storageRef = this.storage.ref(this.auth.userId!);
    const image = storageRef.getDownloadURL().pipe(catchError(() => of(null)));

    const collection = this.firestore
      .collection('profile-details', (ref) =>
        ref.where('userId', '==', this.auth.userId)
      )
      .get()
      .pipe(map((result) => result.docs.map((doc) => doc.data())[0]));
    return combineLatest([image, collection]);
  }

  public getPreviewDetails(): Observable<any> {
    return combineLatest([this.getProfileDetails(), this.getLinks()]);
  }

  private uploadImage(image: File) {
    const ref = this.storage.ref(this.auth.userId!);

    ref
      .put(image)
      .then(() => {
        console.log('image uploaded successfully');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
