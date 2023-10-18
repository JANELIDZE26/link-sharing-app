import { Component } from '@angular/core';

@Component({
  selector: 'app-customize-links',
  templateUrl: './customize-links.component.html',
  styleUrls: ['./customize-links.component.scss'],
})
export class CustomizeLinksComponent {
  private linksQuantity: number = 0;
  public links: number[] = [];

  onLinkAdd(): void {
    this.links.push(this.linksQuantity++);
  }
}
