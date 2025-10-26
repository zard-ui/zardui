import { animate, state, style, transition, trigger } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { BasePortalOutlet, CdkPortalOutlet, type ComponentPortal, PortalModule, type TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  inject,
  NgModule,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import type { ClassValue } from 'clsx';

import { alertDialogVariants, type ZardAlertDialogVariants } from './alert-dialog.variants';
import { ZardButtonComponent } from '../button/button.component';
import { ZardAlertDialogService } from './alert-dialog.service';
import type { ZardAlertDialogRef } from './alert-dialog-ref';
import { generateId, mergeClasses } from '../../shared/utils/utils';

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
    '[@alertDialogAnimation]': 'state()',
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
    `,
  ],
  animations: [
    trigger('alertDialogAnimation', [
      state('close', style({ opacity: 0, transform: 'scale(0.9)' })),
      state('open', style({ opacity: 1, transform: 'scale(1)' })),
      transition('close => open', animate('150ms ease-out')),
      transition('open => close', animate('150ms ease-in')),
    ]),
  ],
})
export class ZardAlertDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardAlertDialogOptions<T>);

  protected readonly classes = computed(() =>
    mergeClasses(
      alertDialogVariants({
        zType: this.config.zType,
      }),
      this.config.zCustomClasses,
    ),
  );

  private readonly alertDialogId = generateId('alert-dialog');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.alertDialogId}-title` : null));
  protected readonly descriptionId = computed(() => (this.config.zDescription ? `${this.alertDialogId}-description` : null));

  public alertDialogRef?: ZardAlertDialogRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();
  state = signal<'close' | 'open'>('close');

  constructor() {
    super();
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet()?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }

    return this.portalOutlet()?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCancelClick() {
    this.cancelTriggered.emit();
  }
}

@NgModule({
  imports: [ZardButtonComponent, ZardAlertDialogComponent, OverlayModule, PortalModule, A11yModule],
  providers: [ZardAlertDialogService],
})
export class ZardAlertDialogModule {}
