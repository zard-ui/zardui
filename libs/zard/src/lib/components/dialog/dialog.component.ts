import { filter, fromEvent, takeUntil } from 'rxjs';

import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
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
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../components';
import { ZardDialogRef } from './dialog-ref';
import { ZardDialogService } from './dialog.service';
import { dialogVariants } from './dialog.variants';

const noopFun = () => void 0;
export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardDialogOptions<T> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zData?: object;
  zDescription?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-dialog',
  exportAs: 'zDialog',
  imports: [OverlayModule, PortalModule, ZardButtonComponent],
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-state]': 'state()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
  },
})
export class ZardDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly overlayRef = inject(OverlayRef);
  protected readonly config = inject(ZardDialogOptions<T>);

  protected readonly classes = computed(() => mergeClasses(dialogVariants()));
  public dialogRef?: ZardDialogRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

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
    if (this.portalOutlet?.hasAttached()) {
      throw Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet?.hasAttached()) {
      throw Error('Attempting to attach modal content after content is already attached');
    }

    return this.portalOutlet?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCloseClick() {
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
  imports: [CommonModule, ZardButtonComponent, ZardDialogComponent, OverlayModule, PortalModule],
  providers: [ZardDialogService],
})
export class ZardDialogModule {}
