import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, first, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { LinksService } from 'src/app/services/links/links.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { SpinnerState } from 'src/models/enums/spinners';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'app-customize-links',
  templateUrl: './customize-links.component.html',
  styleUrls: ['./customize-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeLinksComponent implements OnInit, OnDestroy {
  private isEditMode: boolean = false;
  private initialCheckDone: boolean = false;
  public isSaveDisabled: boolean = true;
  public links: Link[] | undefined;

  private unsubscribes$ = new Subject<void>();

  constructor(
    private linksService: LinksService,
    private api: ApiService,
    private changeDetector: ChangeDetectorRef,
    private spinnerService: SpinnerService
  ) {}

  get showSpinner(): boolean {
    return this.spinnerService.getSpinnerState(SpinnerState.links);
  }

  ngOnInit() {
    this.linksService.links$
      .pipe(takeUntil(this.unsubscribes$))
      .subscribe((links) => {
        if (!this.initialCheckDone) {
          if (!links.length) {
            this.isEditMode = false;
          } else {
            this.isEditMode = true;
          }
          this.initialCheckDone = true;
        }
        if (!links.length) {
          this.isSaveDisabled = true;
        } else {
          this.isSaveDisabled = false;
        }
        this.links = links;
        this.changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribes$.next();
    this.unsubscribes$.complete();
  }

  onLinkAdd(): void {
    this.linksService.addLink();
  }

  onSave(): void {
    if (this.isSaveDisabled) return;
    console.log(this.isEditMode);
    if (this.isEditMode) {
      this.api.editLinks(this.linksService.getLinksAsFirebaseObject());
    } else {
      this.api.addLinks(this.linksService.getLinksAsFirebaseObject());
    }
  }
}
