import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss'],
})
export class AddLinkComponent {
  @Input() index!: number;
  public model = {
    platform: '',
    link: '',
  };
}