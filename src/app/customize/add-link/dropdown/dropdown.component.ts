import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LinksService } from 'src/app/services/links/links.service';
import { Platform } from 'src/models/enums/platform';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnInit {
  @Input({ required: true }) link!: Link;
  @Output() public emitSelectedOption = new EventEmitter<Platform>();

  public readonly ICON_URL_PREFIX: string = `../../../assets/images/platforms`;
  public selectedOption!: Platform;
  public options: Platform[] = [];
  public isOpened: boolean = false;

  constructor(private linksService: LinksService) {}

  public ngOnInit(): void {
    this.options = Object.values(Platform);
    this.selectedOption = this.link.platform;
  }

  public toggle(event: Event): void {
    event.stopPropagation();

    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      this.linksService.setCurrentlyEditingLink(this.link.id);
    } else {
      this.linksService.unsetCurrentlyEditingLink();
    }
  }

  public onFocusOut(event: Event): void {
    this.isOpened = false;
    this.linksService.unsetCurrentlyEditingLink();
    event.stopPropagation();
  }

  public onChooseOption(option: Platform, event: Event): void {
    this.selectedOption = this.options.find((platform) => platform === option)!;
    this.emitSelectedOption.emit(this.selectedOption);
    this.isOpened = false;
    this.linksService.editPlatform(this.selectedOption);
    event.stopPropagation();
  }
}
