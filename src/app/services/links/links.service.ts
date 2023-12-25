import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Platform } from 'src/models/enums/platform';
import { FirebaseUserProfile } from 'src/models/interfaces/firebaseUser';
import { Link } from 'src/models/interfaces/link';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private _links$ = new BehaviorSubject<Map<string, Link>>(new Map());
  private currentlyEditing: Link | undefined;

  get links$(): Observable<Link[]> {
    return this._links$
      .asObservable()
      .pipe(map((links) => Array.from(links.values())));
  }

  constructor(private auth: AuthService) {}

  public setLinks(links: Map<string, Link>): void {
    this._links$.next(links);
  }

  private getLink(linkId: string): Link | undefined {
    return this.getLinks().get(linkId);
  }

  private getLinks(): Map<string, Link> {
    return this._links$.getValue();
  }

  public getLinksAsFirebaseObject(): FirebaseUserProfile {
    const links: FirebaseUserProfile = {
      userId: '',
      links: {},
    };

    for (const [id, link] of this.getLinks().entries()) {
      links.links[id] = link;
    }

    links.userId = this.auth.userId!;

    return links;
  }

  public setCurrentlyEditingLink(linkId: string): void {
    this.currentlyEditing = this.getLink(linkId);
  }

  public unsetCurrentlyEditingLink(): void {
    this.currentlyEditing = undefined;
    this._links$.next(this.getLinks());
  }

  public editPlatformLink(value: string): void {
    this.currentlyEditing!.linkUrl = value;
  }

  public editPlatform(value: Platform): void {
    this.currentlyEditing!.platform = value;
  }

  public removeLink(id: string): void {
    this.getLinks().delete(id);
    this._links$.next(this.getLinks());
  }

  public addLink(): void {
    const links = this.getLinks();

    const newLink: Link = {
      id: uuid.v4(),
      linkUrl: '',
      platform: Platform.Github,
    };

    links.set(newLink.id, newLink);

    this._links$.next(links);
  }
}
