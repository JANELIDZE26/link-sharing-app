import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { LinksService } from '../services/links/links.service';
import { ProfileDetailsService } from '../services/profile-details/profile-details.service';
import { SpinnerService } from '../services/spinner/spinner.service';
import { SpinnerState } from 'src/models/enums/spinners';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeComponent implements OnInit {
  constructor(
    private api: ApiService,
    private linksService: LinksService,
    private profileDetailsService: ProfileDetailsService,
    private spinnerService: SpinnerService
  ) {}
  ngOnInit(): void {
    this.spinnerService.changeSpinnerState({
      [SpinnerState.links]: true,
    });
    this.api
      .getPreviewDetails()
      .subscribe(([[image, profileDetails], links]) => {
        this.linksService.setLinks(links);
        this.profileDetailsService.setProfileDetails(profileDetails);
        this.profileDetailsService.setImageUrl(image);
      });
  }
}
