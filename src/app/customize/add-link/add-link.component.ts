import { Component, Input } from '@angular/core';
import { PlatformOption } from 'src/models/interfaces/platform-option';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss'],
})
export class AddLinkComponent {
  @Input() id!: number;
  public model = {
    platform: '',
    link: '',
  };
  public selectedOption: string | undefined;

  public onChooseOption(platformOption: PlatformOption): void {
    this.selectedOption = platformOption.platform;
  }
}
