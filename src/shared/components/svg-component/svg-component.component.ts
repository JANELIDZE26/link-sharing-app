import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-svg-component',
  templateUrl: './svg-component.component.html',
  styleUrls: ['./svg-component.component.scss'],
})
export class SvgComponentComponent implements OnDestroy {
  // TODO try to fetch data always in same order.
  private unsubscribes$ = new Subject<void>();

  @Input({ required: true }) public set iconPath(iconPath: string) {
    this.loadSvg(iconPath);
  }
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
  ngOnDestroy(): void {
    this.unsubscribes$.next();
    this.unsubscribes$.complete();
  }

  private loadSvg(iconPath: string): void {
    this.http
      .get(iconPath, {
        responseType: 'text',
      })
      .pipe(takeUntil(this.unsubscribes$))
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
