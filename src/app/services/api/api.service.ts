import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FirebaseUserProfile } from 'src/models/interfaces/firebaseUser';
import { AuthService } from '../auth/auth.service';
import { Observable, combineLatest, map, merge } from 'rxjs';
import { Link } from 'src/models/interfaces/link';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private auth: AuthService
  ) {}

  public addUserData(userProfile: FirebaseUserProfile): void {
    const collection = this.firestore.collection('links');
    collection
      .add(userProfile)
      .then(() => {
        this.router.navigateByUrl('customize/profile-details');
      })
      .catch((error) => console.error(error));
  }

  public editLinks(userData: FirebaseUserProfile) {
    const collection = this.firestore.collection('links', (ref) =>
      ref.where('userId', '==', this.auth.userId)
    );
    collection.get().forEach((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Update the document with the new data
        collection.doc(doc.id).update(userData);
      });
    });
  }

  public fetchUserData(): Observable<Map<string, Link>> {
    return this.firestore
      .collection('links', (ref) => ref.where('userId', '==', this.auth.userId))
      .get()
      .pipe(
        map((result) => {
          const userData: FirebaseUserProfile = result.docs.map((doc) =>
            doc.data()
          )[0] as FirebaseUserProfile;
          return new Map<string, Link>(Object.entries(userData.links));
        })
      );
  }

  public saveProfileDetails(profileDetails: ProfileDetails): void {
    // upload profile image
    const ref = this.storage.ref(this.auth.userId!);
    const { profileImage, ...profileDetailsForm } = profileDetails;

    if (profileImage) {
      this.uploadImage(profileImage);
    }

    const collection = this.firestore.collection('profile-details');

    collection
      .add({ ...profileDetailsForm, userId: this.auth.userId })
      .then(() => {
        console.log('[FROM SAVE]');

        // this.router.navigateByUrl('preview');
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
    collection.get().forEach((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Update the document with the new data
        console.log('[FROM EDIT]');
        collection.doc(doc.id).update(profileDetailsForm);
      });
    });
  }

  public getProfileDetails() {
    const storageRef = this.storage.ref(this.auth.userId!);
    const image = storageRef.getDownloadURL();

    const collection = this.firestore
      .collection('profile-details', (ref) =>
        ref.where('userId', '==', this.auth.userId)
      )
      .get()
      .pipe(
        map((result) => {
          const data = result.docs.map((doc) => doc.data())[0];

          return data;
        })
      );
    return combineLatest([image, collection]);
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

  // TODO implement Save, Get, Edit for profile details
}
