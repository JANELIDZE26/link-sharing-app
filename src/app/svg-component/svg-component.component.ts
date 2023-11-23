import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-svg-component',
  templateUrl: './svg-component.component.html',
  styleUrls: ['./svg-component.component.scss'],
})
export class SvgComponentComponent implements OnInit {
  // TODO rewrite svg manipulations using js.
  // TODO try to fetch data always in same order.

  @Input({ required: true }) iconPath!: string;
  @Input({ required: false }) dimensions?:
    | { width: string; height: string }
    | undefined;
  @Input({ required: false }) color: string | undefined;

  public svg: string | undefined;
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSvg();
  }

  private loadSvg(): void {
    this.http
      .get(this.iconPath, {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.svg = data;
        this.changeDetectorRef.detectChanges();
        this.setStyleToSvg();
      });
  }

  private setStyleToSvg(): void {
    const svgElement: SVGSVGElement = (
      this.svgContainer.nativeElement as HTMLElement
    ).querySelector('svg')!;

    if (this.dimensions) {
      svgElement.style.width = this.dimensions.width;
      svgElement.style.height = this.dimensions.height;
    }

    if (svgElement) {
      this.setStyleToPath(svgElement);
    }
  }

  private setStyleToPath(svg: SVGSVGElement): void {
    const path = svg.querySelector('path');

    if (path && this.color) {
      path.setAttribute('fill', this.color);
    }
  }
}
