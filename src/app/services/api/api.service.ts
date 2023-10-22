import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: AngularFirestore) {}

  addLinks(link: any) {
    const collection = this.firestore.collection('links');
    collection
      .add(link)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }
}
