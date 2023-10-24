import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FirebaseUserProfile } from 'src/models/interfaces/firebaseUser';
import { AuthService } from '../auth/auth.service';
import { Observable, map } from 'rxjs';
import { Link } from 'src/models/interfaces/link';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private firestore: AngularFirestore,
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
}
