

```angular-ts title="alert-dialog.component.ts" copyButton showLineNumbers
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

  private alertDialogId = generateId('alert-dialog');
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

```



```angular-ts title="alert-dialog.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva('fixed z-50 w-full max-w-[calc(100%-2rem)] border bg-background shadow-lg transition-all duration-200 ease-out rounded-lg sm:max-w-lg', {
  variants: {
    zType: {
      default: '',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;

```



```angular-ts title="alert-dialog-ref.ts" copyButton showLineNumbers
import { filter, fromEvent, Observable, Subject, takeUntil } from 'rxjs';

import { OverlayRef } from '@angular/cdk/overlay';

import { OnClickCallback, ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

export class ZardAlertDialogRef<T = unknown, R = unknown> {
  componentInstance?: T;
  private destroy$ = new Subject<void>();
  private readonly afterClosedSubject: Subject<R | undefined> = new Subject();

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardAlertDialogOptions<T>,
    private containerInstance: ZardAlertDialogComponent<T>,
  ) {
    containerInstance.cancelTriggered.subscribe(() => {
      this.handleCancel();
    });

    containerInstance.okTriggered.subscribe(() => {
      this.handleOk();
    });

    this.handleMaskClick();

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.close());
  }

  close(dialogResult?: R): void {
    this.containerInstance.state.set('close');

    setTimeout(() => {
      this.overlayRef.dispose();
      this.afterClosedSubject.next(dialogResult);
      this.afterClosedSubject.complete();
      this.destroy$.next();
      this.destroy$.complete();
    }, 200);
  }

  afterClosed(): Observable<R | undefined> {
    return this.afterClosedSubject.asObservable();
  }

  private handleCancel() {
    const cancelFn = this.config.zOnCancel;

    if (typeof cancelFn === 'function') {
      const result = (cancelFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }

  private handleOk() {
    const okFn = this.config.zOnOk;

    if (typeof okFn === 'function') {
      const result = (okFn as OnClickCallback<T>)(this.componentInstance as T);
      if (result !== false) {
        this.close(result as R);
      }
    } else {
      this.close();
    }
  }

  private handleMaskClick() {
    if (this.config.zMaskClosable) {
      this.containerInstance
        .overlayClickOutside()
        .pipe(filter(() => this.config.zMaskClosable === true))
        .subscribe(() => {
          this.close();
        });
    }
  }
}

```



```angular-html title="alert-dialog.component.html" copyButton showLineNumbers
<div class="flex flex-col gap-4 p-6" cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
  @if (config.zTitle || config.zDescription) {
    <header class="flex flex-col gap-2 text-center sm:text-left">
      @if (config.zTitle) {
        <h2 data-testid="z-alert-title" [id]="titleId()" class="text-lg font-semibold">{{ config.zTitle }}</h2>
      }

      @if (config.zDescription) {
        <p data-testid="z-alert-description" [id]="descriptionId()" class="text-sm text-muted-foreground">{{ config.zDescription }}</p>
      }
    </header>
  }

  <main>
    <ng-template cdkPortalOutlet></ng-template>

    @if (isStringContent) {
      <div data-testid="z-alert-content" [innerHTML]="config.zContent"></div>
    }
  </main>

  <footer class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    @if (config.zCancelText !== null) {
      <button data-testid="z-alert-cancel-button" z-button zType="outline" (click)="onCancelClick()">
        {{ config.zCancelText || 'Cancel' }}
      </button>
    }

    @if (config.zOkText !== null) {
      <button data-testid="z-alert-ok-button" z-button [zType]="config.zOkDestructive ? 'destructive' : 'default'" [disabled]="config.zOkDisabled" (click)="onOkClick()">
        {{ config.zOkText || 'Continue' }}
      </button>
    }
  </footer>
</div>

```



```angular-ts title="alert-dialog.service.ts" copyButton showLineNumbers
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogComponent, ZardAlertDialogOptions } from './alert-dialog.component';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string | undefined;
export const Z_ALERT_MODAL_DATA = new InjectionToken<unknown>('Z_ALERT_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardAlertDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  create<T>(config: ZardAlertDialogOptions<T>): ZardAlertDialogRef<T> {
    return this.open<T>(config.zContent, config);
  }

  confirm<T>(
    config: Omit<ZardAlertDialogOptions<T>, 'zOkText' | 'zCancelText'> & {
      zOkText?: string;
      zCancelText?: string;
    },
  ): ZardAlertDialogRef<T> {
    const confirmConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText || 'Confirm',
      zCancelText: config.zCancelText || 'Cancel',
      zOkDestructive: config.zOkDestructive ?? false,
      zIcon: config.zIcon,
      zType: config.zType || 'default',
    };
    return this.create(confirmConfig);
  }

  warning<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const warningConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText || 'OK',
      zCancelText: null,
      zIcon: config.zIcon || 'alert-triangle',
      zType: config.zType || 'warning',
    };
    return this.create(warningConfig);
  }

  info<T>(config: Omit<ZardAlertDialogOptions<T>, 'zOkText'> & { zOkText?: string }): ZardAlertDialogRef<T> {
    const infoConfig: ZardAlertDialogOptions<T> = {
      ...config,
      zOkText: config.zOkText || 'OK',
      zCancelText: null,
      zIcon: config.zIcon || 'info',
      zType: config.zType || 'default',
    };
    return this.create(infoConfig);
  }

  private open<T>(componentOrTemplateRef: ContentType<T>, config: ZardAlertDialogOptions<T>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      // Return a mock alert dialog ref for SSR environments
      return new ZardAlertDialogRef(undefined as any, config, undefined as any);
    }

    const alertDialogContainer = this.attachAlertDialogContainer<T>(overlayRef, config);

    const alertDialogRef = this.attachAlertDialogContent<T>(componentOrTemplateRef, alertDialogContainer, overlayRef, config);
    alertDialogContainer.alertDialogRef = alertDialogRef;

    return alertDialogRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const overlayConfig = new OverlayConfig({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position().global(),
      });

      return this.overlay.create(overlayConfig);
    }
    return undefined;
  }

  private attachAlertDialogContainer<T>(overlayRef: OverlayRef, config: ZardAlertDialogOptions<T>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardAlertDialogOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardAlertDialogComponent<T>>(ZardAlertDialogComponent, config.zViewContainerRef, injector);
    const containerRef = overlayRef.attach<ZardAlertDialogComponent<T>>(containerPortal);

    // Pequeno delay para evitar reflow durante a renderização inicial
    setTimeout(() => {
      containerRef.instance.state.set('open');
    }, 10);

    return containerRef.instance;
  }

  private attachAlertDialogContent<T>(
    componentOrTemplateRef: ContentType<T>,
    alertDialogContainer: ZardAlertDialogComponent<T>,
    overlayRef: OverlayRef,
    config: ZardAlertDialogOptions<T>,
  ) {
    const alertDialogRef = new ZardAlertDialogRef<T>(overlayRef, config, alertDialogContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      alertDialogContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          alertDialogRef: alertDialogRef,
        } as any),
      );
    } else if (componentOrTemplateRef && typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T>(alertDialogRef, config);
      const contentRef = alertDialogContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      alertDialogRef.componentInstance = contentRef.instance;
    }

    return alertDialogRef;
  }

  private createInjector<T>(alertDialogRef: ZardAlertDialogRef<T>, config: ZardAlertDialogOptions<T>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardAlertDialogRef, useValue: alertDialogRef },
        { provide: Z_ALERT_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}

```

