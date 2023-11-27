import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { Link } from 'src/models/interfaces/link';
import { Platform } from 'src/models/enums/platform';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss', '../../shared/styles/platforms.scss'],
})
export class PreviewComponent implements OnInit {
  public profileImage: string | undefined;
  public profileDetails: ProfileDetails | undefined;
  public links: Link[] | undefined;
  public showSpinner: boolean = false;
  public readonly PLATFORM = Platform;

  constructor(private api: ApiService, private hotToast: HotToastService) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.api.getPreviewDetails().subscribe(
      ([[image, profileDetails], links]) => {
        this.profileImage = image;
        this.profileDetails = profileDetails;
        this.links = Array.from(links as Map<string, Link>).map(
          ([_, link]) => link
        );
      },
      null,
      () => {
        this.showSpinner = false;
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
}
