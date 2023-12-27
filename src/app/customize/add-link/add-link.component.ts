import { LinksService } from 'src/app/services/links/links.service';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Link } from 'src/models/interfaces/link';
import { Platform } from 'src/models/enums/platform';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddLinkComponent {
  @Input({ required: true }) public index!: number;
  @Input({ required: true }) public link!: Link;

  public selectedOption: string | undefined;

  constructor(private linksService: LinksService) {}

  public onFocus(): void {
    this.linksService.setCurrentlyEditingLink(this.link.id);
  }

  public onFocusOut(): void {
    this.linksService.unsetCurrentlyEditingLink();
  }

  public onChange(event: Event): void {
    this.linksService.editPlatformLink(
      (event.target as HTMLInputElement).value
    );
  }

  public onRemove(): void {
    this.linksService.removeLink(this.link.id);
  }

  public onChooseOption(platform: Platform): void {
    this.selectedOption = platform;
  }
}
