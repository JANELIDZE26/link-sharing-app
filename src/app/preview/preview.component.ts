import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { Link } from 'src/models/interfaces/link';
import { Platform } from 'src/models/enums/platform';
import { HotToastService } from '@ngneat/hot-toast';
import { LinksService } from '../services/links/links.service';
import { ProfileDetailsService } from '../services/profile-details/profile-details.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { zip, takeUntil, filter, Subject, tap } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss', '../../shared/styles/platforms.scss'],
})
export class PreviewComponent implements OnInit {
  public imageUrl: string | ArrayBuffer | null | undefined;
  public profileDetails: ProfileDetails | null = null;
  public links: Link[] | undefined;
  public showSpinner: boolean = false;
  public readonly PLATFORM = Platform;
  private unsubscribes$ = new Subject<void>();
  @ViewChild('logoutModal', { static: true }) logout!: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private hotToast: HotToastService,
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgxSmartModalService,
    private changeDetector: ChangeDetectorRef,
    private viewcontainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.modalService.create('logout', this.logout, this.viewcontainer, {
      backdrop: true,
      target: 'body',
      dismissable: true,
      closable: false,
    });

    this.showSpinner = true;
    zip([
      this.profileDetailsService.imageUrl$,
      this.profileDetailsService.profileDetails$,
      this.linksService.links$,
    ])
      .pipe(
        takeUntil(this.unsubscribes$),
        tap(([image, userProfile, links]) => {
          console.log(image, userProfile, links);
          if (!image && !userProfile && !links.length) {
            this.retrieveFromServer();
          }
        }),
        filter(
          ([image, userProfile, links]) =>
            !!image || !!userProfile || !!links.length
        )
      )
      .subscribe(
        ([image, userProfile, links]) => {
          this.imageUrl = image;
          this.profileDetails = userProfile;
          this.links = links;
          this.showSpinner = false;
          this.changeDetector.detectChanges();
        },
        () => {
          this.showSpinner = false;
          this.changeDetector.detectChanges();
        }
      );
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

  onCopyToClipboard(element: any) {
    const url = window.location.href; // Gets the full URL
    navigator.clipboard.writeText(url).then(
      () => {
        this.showToastr(element);
      },
      (err) => {
        console.error('Failed to copy URL: ', err);
      }
    );
  }

  showToastr(element: any): void {
    this.hotToast.show(element, {
      position: 'bottom-center',
      className: 'toastrClass',
    });
  }

  onLogout(): void {
    this.modalService.getModal('logout').open(true);
  }

  onCancelModal() {
    this.modalService.getModal('logout').close();
  }

  public logOut(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/auth');
  }

  private retrieveFromServer(): void {
    this.api
      .getPreviewDetails()
      .pipe(takeUntil(this.unsubscribes$))
      .subscribe(
        ([[image, profileDetails], links]) => {
          this.imageUrl = image;
          this.profileDetails = profileDetails;
          this.links = Array.from(links as Map<string, Link>).map(
            ([_, link]) => link
          );
          this.linksService.setLinks(links);
          this.profileDetailsService.setProfileDetails(profileDetails);
          this.profileDetailsService.setImageUrl(image);
        },
        null,
        () => {
          this.showSpinner = false;
        }
      );
  }
}
