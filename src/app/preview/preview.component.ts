import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { ProfileDetails } from 'src/models/interfaces/profile-details-form';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  public profileImage: string | undefined;
  public profileDetails: ProfileDetails | undefined;
  public links: Map<string, Link> | undefined;

  constructor(private api: ApiService) {}
  
  ngOnInit(): void {
    this.api
      .getPreviewDetails()
      .subscribe(([[image, profileDetails], links]) => {
        this.profileImage = image;
        this.profileDetails = profileDetails;
        this.links = links;
      });
  }
}
