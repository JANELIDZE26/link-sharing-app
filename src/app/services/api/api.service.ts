import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FirebaseLinks } from 'src/models/interfaces/firebaseUser';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { Link } from 'src/models/interfaces/link';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SpinnerService } from '../spinner/spinner.service';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { SpinnerState } from 'src/models/enums/spinners';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private auth: AuthService,
    private spinnerService: SpinnerService
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

  public editLinks(links: FirebaseLinks): void {
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
          this.spinnerService.setSpinnerState({
            [SpinnerState.links]: false,
          });
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

  public getProfileDetails(): Observable<[any, unknown]> {
    const storageRef = this.storage.ref(this.auth.userId!);
    const image = storageRef.getDownloadURL().pipe(catchError(() => of(null)));

    const collection = this.firestore
      .collection('profile-details', (ref) =>
        ref.where('userId', '==', this.auth.userId)
      )
      .get()
      .pipe(map((result) => result.docs.map((doc) => doc.data())[0]));
    return combineLatest([image, collection]).pipe(
      tap(() => {
        this.spinnerService.setSpinnerState({
          [SpinnerState.profileDetails]: false,
          [SpinnerState.imageUrl]: false,
        });
      })
    );
  }

  public getDocumentIdByUserId(
    callBack: Function,
    collectionType: 'links' | 'profile-details'
  ): void {
    this.firestore
      .collection(collectionType, (ref) =>
        ref.where('userId', '==', this.auth.userId)
      )
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          callBack(doc.id);
        });
      })
  }

  public async deleteUserAccount(
    profileDetailsDocumentId: string,
    linksDocumentId: string
  ): Promise<void> {
    try {
      if (profileDetailsDocumentId) {
        await this.firestore
          .collection('profile-details')
          .doc(profileDetailsDocumentId)
          .delete();
        console.log('profile details successfully deleted!');
      }

      if (linksDocumentId) {
        await this.firestore.collection('links').doc(linksDocumentId).delete();

        console.log('links successfully deleted!');
      }

      await this.storage.ref(this.auth.userId!).delete();

      console.log('image successfully deleted!');

      this.router.navigateByUrl('customize/links');
    } catch (error) {
      console.error(error);
    }
  }
  public getPreviewDetails(): Observable<any> {
    return combineLatest([this.getProfileDetails(), this.getLinks()]);
  }

  private uploadImage(image: File): void {
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
