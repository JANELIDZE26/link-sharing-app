import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { LinksService } from 'src/app/services/links/links.service';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-customize-links',
  templateUrl: './customize-links.component.html',
  styleUrls: ['./customize-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeLinksComponent implements OnInit {
  private isEditMode: boolean = false;
  public showSpinner: boolean = false;

  // TODO unsubscribe
  public isSaveDisabled: boolean = true;
  public links$: Observable<Link[]> = this.linksService.links$.pipe(
    tap((links) => {
      if (!links.length) {
        this.isSaveDisabled = true;
      } else {
        this.isSaveDisabled = false;
      }
    })
  );

  constructor(private linksService: LinksService, private api: ApiService) {}

  ngOnInit() {
    this.showSpinner = true;
    this.api.getLinks().subscribe(
      (result) => {
        if (result.size) {
          this.isEditMode = true;
        } else {
          this.isEditMode = false;
        }
        this.linksService.setLinks(result);
      },
      null,
      () => {
        this.showSpinner = false;
      }
    );
  }

  onLinkAdd(): void {
    this.linksService.addLink();
  }

  onSave(): void {
    if (this.isSaveDisabled) return;

    if (this.isEditMode) {
      this.api.editLinks(this.linksService.getLinksAsFirebaseObject());
    } else {
      this.api.addLinks(this.linksService.getLinksAsFirebaseObject());
    }
  }
}
