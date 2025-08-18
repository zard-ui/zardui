

```angular-ts title="dialog.component.ts" copyButton showLineNumbers
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
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { filter, fromEvent, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ZardButtonComponent } from '../button/button.component';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardDialogService } from './dialog.service';
import { dialogVariants } from './dialog.variants';
import { ZardDialogRef } from './dialog-ref';

const noopFun = () => void 0;
export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardDialogOptions<T> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: string;
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

  protected readonly classes = computed(() => mergeClasses(dialogVariants(), this.config.zCustomClasses));
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



```angular-ts title="dialog.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg max-w-[calc(100%-2rem)] sm:max-w-[425px] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
);
export type ZardDialogVariants = VariantProps<typeof dialogVariants>;

```



```angular-ts title="dialog-ref.ts" copyButton showLineNumbers
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

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

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
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



```angular-html title="dialog.component.html" copyButton showLineNumbers
@if (config.zClosable || config.zClosable === undefined) {
  <button data-testid="z-close-header-button" z-button zType="ghost" zSize="sm" class="absolute right-1 top-1" (click)="onCloseClick()">
    <i class="icon-x text-sm"></i>
  </button>
}

@if (config.zTitle || config.zDescription) {
  <header class="flex flex-col space-y-1.5 text-center sm:text-left">
    @if (config.zTitle) {
      <h4 data-testid="z-title" class="text-lg font-semibold leading-none tracking-tight">{{ config.zTitle }}</h4>

      @if (config.zDescription) {
        <p data-testid="z-description" class="text-sm text-muted-foreground">{{ config.zDescription }}</p>
      }
    }
  </header>
}

<main class="flex flex-col space-y-4">
  <ng-template cdkPortalOutlet></ng-template>

  @if (isStringContent) {
    <div data-testid="z-content" [innerHTML]="config.zContent"></div>
  }
</main>

@if (!config.zHideFooter) {
  <footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2">
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



```angular-ts title="dialog.service.ts" copyButton showLineNumbers
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

