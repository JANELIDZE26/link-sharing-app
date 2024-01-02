import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { LinksService } from '../services/links/links.service';
import { ProfileDetailsService } from '../services/profile-details/profile-details.service';
import { SpinnerService } from '../services/spinner/spinner.service';
import { SpinnerState } from 'src/models/enums/spinners';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeComponent implements OnInit, OnDestroy {
  private unsubscribes$ = new Subject<void>();
  constructor(
    private api: ApiService,
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService,
    private spinnerService: SpinnerService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribes$.next();
    this.unsubscribes$.complete();
  }
  ngOnInit(): void {
    this.spinnerService.setSpinnerState({
      [SpinnerState.links]: true,
      [SpinnerState.profileDetails]: true,
      [SpinnerState.imageUrl]: true,
    });

    this.api.getDocumentIdByUserId((documentId: string) => {
      this.profileDetailsService.profileDetailsDocumentId = documentId;
    }, 'profile-details');
    this.api.getDocumentIdByUserId((documentId: string) => {
      this.linksService.linksDocumentId = documentId;
    }, 'links');

    this.api
      .getPreviewDetails()
      .pipe(takeUntil(this.unsubscribes$))
      .subscribe(([[image, profileDetails], links]) => {
        this.linksService.setLinks(links);

        this.profileDetailsService.setProfileDetails(profileDetails);

        this.profileDetailsService.setImageUrl(image);
      });
  }
}
