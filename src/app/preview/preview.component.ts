import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { Link } from 'src/models/interfaces/link';
import { Platform } from 'src/models/enums/platform';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  public profileImage: string | undefined;
  public profileDetails: ProfileDetails | undefined;
  public links: Link[] | undefined;
  public readonly PLATFORM = Platform;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .getPreviewDetails()
      .subscribe(([[image, profileDetails], links]) => {
        this.profileImage = image;
        this.profileDetails = profileDetails;
        this.links = Array.from(links as Map<string, Link>).map(
          ([_, link]) => link
        );
      });
  }

  onOpenLink(link: string): void {
    const prefix = 'http://www';

    if (!link.startsWith(prefix)) {
      window.open(`${prefix}.${link}`, '_blank');
    } else {
      window.open(link, '_blank');
    }
  }
}
