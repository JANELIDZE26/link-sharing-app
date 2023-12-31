import {
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
import { takeUntil, Subject } from 'rxjs';
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
  private modalConfiguration = {
    backdrop: true,
    target: 'body',
    dismissable: true,
    closable: false,
  };
  private linksDocumentId: string | undefined;
  private profileDetailsDocumentId: string | undefined;

  @ViewChild('logoutModal', { static: true }) logoutRef!: TemplateRef<any>;
  @ViewChild('deleteProfileModal', { static: true })
  deleteProfileRef!: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private hotToast: HotToastService,
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgxSmartModalService,
    private viewcontainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.modalService.create(
      'logout',
      this.logoutRef,
      this.viewcontainer,
      this.modalConfiguration
    );

    this.modalService.create(
      'deleteProfile',
      this.deleteProfileRef,
      this.viewcontainer,
      this.modalConfiguration
    );

    this.api.getDocumentIdByUserId((documentId: string) => {
      this.linksDocumentId = documentId;
    }, 'links');

    this.api.getDocumentIdByUserId((documentId: string) => {
      this.profileDetailsDocumentId = documentId;
    }, 'profile-details');

    this.showSpinner = true;
    this.retrieveFromServer();
  }

  onOpenLink(link: string): void {
    if (this.isValidUrl(link)) {
      window.open(link, '_blank');
    } else {
      console.error('Invalid link');
      this.hotToast.show('Invalid Link', {
        position: 'bottom-center',
        className: 'toastrClass warning',
      });
    }
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

  onLogoutModal(): void {
    this.modalService.getModal('logout').open(true);
  }

  onCancelModal() {
    this.modalService.getModal('logout').close();
    this.modalService.getModal('deleteProfile').close();
  }

  logOut(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/auth');
  }

  onOpenDeleteProfileModal(): void {
    this.modalService.getModal('deleteProfile').open();
  }

  deleteProfile(): void {
    this.modalService.getModal('deleteProfile').close();

    this.api.deleteUserAccount(
      this.profileDetailsDocumentId!,
      this.linksDocumentId!
    );
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

  private isValidUrl(url: string): boolean {
    // URL validation logic (same as above)
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
    return urlPattern.test(url);
  }
}
