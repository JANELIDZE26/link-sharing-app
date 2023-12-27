import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { LinksService } from 'src/app/services/links/links.service';
import { ProfileDetailsService } from 'src/app/services/profile-details/profile-details.service';
import { Platform } from 'src/models/enums/platform';
import { Link } from 'src/models/interfaces/link';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';

@Component({
  selector: 'app-smartphone-view',
  templateUrl: './smartphone-view.component.html',
  styleUrls: [
    './smartphone-view.component.scss',
    '../../../shared/styles/platforms.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartphoneViewComponent implements OnInit {
  public readonly PLATFORM = Platform;
  public links$: Observable<Link[]> = this.linksService.links$;
  public profileDetails$ = this.profileDetailsService.profileDetails$;
  public imageUrl$ = this.profileDetailsService.imageUrl$;

  constructor(
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    if (
      this.router.url === '/customize/links' &&
      !this.profileDetailsService.isProfileDetailsLoaded
    ) {
      this.apiService.getProfileDetails().subscribe(([image, userProfile]) => {
        this.profileDetailsService.setProfileDetails(
          userProfile as ProfileDetails
        );
        this.profileDetailsService.setImageUrl(image);
      });
    } else if (
      this.router.url === '/customize/profile-details' &&
      !this.linksService.linksAreLoaded
    ) {
      this.apiService.getLinks().subscribe((result) => {
        this.linksService.setLinks(result);
      });
    }
  }

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
