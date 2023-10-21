import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Platform } from 'src/models/enums/platform';
import { PlatformOption } from 'src/models/interfaces/platform-option';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  private readonly ICON_URL_PREFIX: string = `../../../assets/images/platforms/`;
  @Output() public emitSelectedOption = new EventEmitter<PlatformOption>();
  public selectedOption!: PlatformOption;
  public options: PlatformOption[] = [];
  public isOpened: boolean = false;

  public ngOnInit(): void {
    this.options = Object.values(Platform).map((platform) => {
      return {
        iconUrl: this.ICON_URL_PREFIX + `${platform}.svg`,
        platform,
        isSelected: false,
      };
    });
    this.selectedOption = this.options[0];
  }

  public toggle(): void {
    this.isOpened = !this.isOpened;
  }

  public onChooseOption(index: number): void {
    this.selectedOption = this.options[index];
    this.emitSelectedOption.emit(this.selectedOption);
  }
}
