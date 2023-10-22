import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { LinksService } from 'src/app/services/links/links.service';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-customize-links',
  templateUrl: './customize-links.component.html',
  styleUrls: ['./customize-links.component.scss'],
})
export class CustomizeLinksComponent {
  // TODO unsubscribe
  public links$: Observable<Link[]> = this.linksService.links$.pipe(
    map((links) => Array.from(links.values()))
  );

  constructor(private linksService: LinksService, private api: ApiService) {}

  onLinkAdd(): void {
    this.linksService.addLink();
  }

  onSave(): void {
    this.api.addLinks(this.linksService.getLinksAsFirebaseObject());
  }
}
