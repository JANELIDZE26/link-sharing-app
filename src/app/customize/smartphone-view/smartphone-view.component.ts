import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { LinksService } from 'src/app/services/links/links.service';
import { ProfileDetailsService } from 'src/app/services/profile-details/profile-details.service';
import { Platform } from 'src/models/enums/platform';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-smartphone-view',
  templateUrl: './smartphone-view.component.html',
  styleUrls: [
    './smartphone-view.component.scss',
    '../../../shared/styles/platforms.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartphoneViewComponent {
  public readonly PLATFORM = Platform;
  public links$: Observable<Link[]> = this.linksService.links$;
  public profileDetails$ = this.profileDetailsService.profileDetails$;
  public imageUrl$ = this.profileDetailsService.imageUrl$;

  constructor(
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService
  ) {}

  onOpenLink(link: string): void {
    if (this.isValidUrl(link)) {
      window.open(link, '_blank');
    } else {
      console.error('Invalid link');
    }
  }

  private isValidUrl(url: string): boolean {
    // URL validation logic (same as above)
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
    return urlPattern.test(url);
  }
}
