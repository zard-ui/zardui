### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dialog.component.ts

```angular-ts showLineNumbers
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
  zCancelText?: string;
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

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dialog.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] sm:rounded-lg',
);
export type ZardDialogVariants = VariantProps<typeof dialogVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dialog-ref.ts

```angular-ts showLineNumbers
import { Subject, takeUntil } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';

import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

export class ZardDialogRef<T = any, R = any> {
  private destroy$ = new Subject<void>();
  protected result?: R;
  componentInstance: T | null = null;

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardDialogOptions<T>,
    private containerInstance: ZardDialogComponent<T>,
  ) {
    this.containerInstance.cancelTriggered.subscribe(() => this.trigger(eTriggerAction.CANCEL));
    this.containerInstance.okTriggered.subscribe(() => this.trigger(eTriggerAction.OK));

    if (this.config.zMaskClosable || this.config.zMaskClosable === undefined) {
      this.containerInstance.getNativeElement().addEventListener(
        'animationend',
        () => {
          this.containerInstance
            .overlayClickOutside()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.close());
        },
        { once: true },
      );
    }
  }

  close(result?: R) {
    this.result = result;
    this.overlayRef.detachBackdrop();
    this.overlayRef.dispose();
    this.destroy$.next();
  }

  private trigger(action: eTriggerAction) {
    const trigger = { ok: this.config.zOnOk, cancel: this.config.zOnCancel }[action];

    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent()) as R;
      this.closeWhitResult(result);
    } else this.close();
  }

  private getContentComponent(): T {
    return this.componentInstance as T;
  }

  private closeWhitResult(result: R): void {
    if (result !== false) this.close(result);
  }
}

```

### <img src="/icons/angular.svg" class="w-4 h-4 inline mr-2" alt="Angular HTML">dialog.component.html

```angular-html showLineNumbers
@if (config.zClosable || config.zClosable === undefined) {
  <button data-testid="z-close-header-button" z-button zType="ghost" zSize="sm" class="absolute right-1 top-1" (click)="onCloseClick()">
    <i class="icon-x text-sm"></i>
  </button>
}

<header class="flex flex-col space-y-1.5 text-center sm:text-left">
  @if (config.zTitle) {
    <h4 data-testid="z-title" class="text-lg font-semibold leading-none tracking-tight">{{ config.zTitle }}</h4>

    @if (config.zDescription) {
      <p data-testid="z-description" class="text-sm text-muted-foreground">{{ config.zDescription }}</p>
    }
  }
</header>

<main class="flex flex-col space-y-4">
  <ng-template cdkPortalOutlet></ng-template>

  @if (isStringContent) {
    <div data-testid="z-content" [innerHTML]="config.zContent"></div>
  }
</main>

@if (!config.zHideFooter) {
  <footer class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
    @if (config.zCancelText !== null) {
      <button data-testid="z-cancel-button" z-button zType="outline" (click)="onCloseClick()">
        @if (config.zCancelIcon) {
          <i class="icon-{{ config.zCancelIcon }}"></i>
        }

        {{ config.zCancelText || 'Cancel' }}
      </button>
    }

    @if (config.zOkText !== null) {
      <button data-testid="z-ok-button" z-button [zType]="config.zOkDestructive ? 'destructive' : 'default'" [disabled]="config.zOkDisabled" (click)="onOkClick()">
        @if (config.zOkIcon) {
          <i class="icon-{{ config.zOkIcon }}"></i>
        }

        {{ config.zOkText || 'OK' }}
      </button>
    }
  </footer>
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dialog.service.ts

```angular-ts showLineNumbers
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, TemplateRef } from '@angular/core';

import { ZardDialogRef } from './dialog-ref';
import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
export const Z_MODAL_DATA = new InjectionToken<any>('Z_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  create<T>(config: ZardDialogOptions<T>): ZardDialogRef<T> {
    return this.open<T>(config.zContent as ComponentType<T>, config);
  }

  private open<T>(componentOrTemplateRef: ContentType<T>, config: ZardDialogOptions<T>) {
    const overlayRef = this.createOverlay();

    const dialogContainer = this.attachDialogContainer<T>(overlayRef, config);

    const dialogRef = this.attachDialogContent<T>(componentOrTemplateRef, dialogContainer, overlayRef, config);
    dialogContainer.dialogRef = dialogRef;

    return dialogRef;
  }

  private createOverlay() {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global(),
    });

    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer<T>(overlayRef: OverlayRef, config: ZardDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardDialogComponent<T>>(ZardDialogComponent, config.zViewContainerRef, injector);
    const containerRef = overlayRef.attach<ZardDialogComponent<T>>(containerPortal);
    containerRef.instance.state.set('open');

    return containerRef.instance;
  }

  private attachDialogContent<T>(componentOrTemplateRef: ContentType<T>, dialogContainer: ZardDialogComponent<T>, overlayRef: OverlayRef, config: ZardDialogOptions<T>) {
    const dialogRef = new ZardDialogRef<T>(overlayRef, config, dialogContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          dialogRef: dialogRef,
        } as any),
      );
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(dialogRef, config);
      const contentRef = dialogContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      dialogRef.componentInstance = contentRef.instance;
    }

    return dialogRef;
  }

  private createInjector<T>(dialogRef: ZardDialogRef<T>, config: ZardDialogOptions<T>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardDialogRef, useValue: dialogRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}

```

