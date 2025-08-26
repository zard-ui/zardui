import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  NgModule,
  output,
  signal,
  TemplateRef,
  Type,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { filter, fromEvent, takeUntil } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
import { ClassValue } from 'clsx';

import { alertDialogVariants, ZardAlertDialogVariants } from './alert-dialog.variants';
import { ZardButtonComponent } from '../button/button.component';
import { ZardAlertDialogService } from './alert-dialog.service';
import { ZardAlertDialogRef } from './alert-dialog-ref';
import { mergeClasses } from '../../shared/utils/utils';

const noopFun = () => void 0;
export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: object;
  zDescription?: string;
  zIcon?: string;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zTitle?: string | TemplateRef<T>;
  zType?: ZardAlertDialogVariants['zType'];
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-alert-dialog',
  exportAs: 'zAlertDialog',
  standalone: true,
  imports: [OverlayModule, PortalModule, ZardButtonComponent, A11yModule],
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-state]': 'state()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    role: 'alertdialog',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
  styles: [
    `
      z-alert-dialog {
        inset: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
        transform-origin: center center;
      }

      z-alert-dialog[data-state='close'] {
        transform: scale(0.95);
        opacity: 0;
      }

      z-alert-dialog[data-state='open'] {
        transform: scale(1);
        opacity: 1;
      }
    `,
  ],
})
export class ZardAlertDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly overlayRef = inject(OverlayRef);
  protected readonly config = inject(ZardAlertDialogOptions<T>);

  protected readonly classes = computed(() =>
    mergeClasses(
      alertDialogVariants({
        zType: this.config.zType,
      }),
      this.config.zCustomClasses,
    ),
  );

  protected readonly titleId = computed(() => (this.config.zTitle ? `alert-dialog-title-${this.generateId()}` : null));
  protected readonly descriptionId = computed(() => (this.config.zDescription ? `alert-dialog-description-${this.generateId()}` : null));
  private alertDialogId = Math.random().toString(36).substring(2, 15);

  public alertDialogRef?: ZardAlertDialogRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();
  state = signal<'close' | 'open'>('close');

  constructor() {
    super();
  }

  private generateId(): string {
    return this.alertDialogId;
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet()?.hasAttached()) {
      throw Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet()?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet()?.hasAttached()) {
      throw Error('Attempting to attach alert dialog content after content is already attached');
    }

    return this.portalOutlet()?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCancelClick() {
    this.cancelTriggered.emit();
  }

  overlayClickOutside() {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        const hasNotOrigin = clickTarget !== this.host.nativeElement;
        const hasNotOverlay = !!this.overlayRef && this.overlayRef.overlayElement.contains(clickTarget) === false;
        return hasNotOrigin && hasNotOverlay;
      }),
      takeUntil(this.overlayRef.detachments()),
    );
  }
}

@NgModule({
  imports: [ZardButtonComponent, ZardAlertDialogComponent, OverlayModule, PortalModule, A11yModule],
  providers: [ZardAlertDialogService],
})
export class ZardAlertDialogModule {}
