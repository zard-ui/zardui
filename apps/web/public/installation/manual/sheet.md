

```angular-ts title="sheet.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
} from '@angular/core';

import type { ZardSheetRef } from './sheet-ref';
import { sheetVariants, type ZardSheetVariants } from './sheet.variants';
import { mergeClasses, noopFun } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardIconComponent } from '../icon/icon.component';
import type { ZardIcon } from '../icon/icons';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardSheetOptions<T, U> {
  zCancelIcon?: ZardIcon;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: string;
  zData?: U;
  zDescription?: string;
  zHeight?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: ZardIcon;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  zSide?: ZardSheetVariants['zSide'] = 'left';
  zSize?: ZardSheetVariants['zSize'] = 'default';
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-sheet',
  exportAs: 'zSheet',
  imports: [OverlayModule, PortalModule, ZardButtonComponent, ZardIconComponent],
  template: `
    @if (config.zClosable || config.zClosable === undefined) {
      <button data-testid="z-close-header-button" z-button zType="ghost" zSize="sm" class="absolute right-1 top-1 cursor-pointer " (click)="onCloseClick()">
        <z-icon zType="x" />
      </button>
    }

    @if (config.zTitle || config.zDescription) {
      <header data-slot="sheet-header" class="flex flex-col gap-1.5 p-4">
        @if (config.zTitle) {
          <h4 data-testid="z-title" data-slot="sheet-title" class="text-lg font-semibold leading-none tracking-tight">{{ config.zTitle }}</h4>

          @if (config.zDescription) {
            <p data-testid="z-description" data-slot="sheet-description" class="text-sm text-muted-foreground">{{ config.zDescription }}</p>
          }
        }
      </header>
    }

    <main class="flex flex-col space-y-4 w-full">
      <ng-template cdkPortalOutlet></ng-template>

      @if (isStringContent) {
        <div data-testid="z-content" data-slot="sheet-content" [innerHTML]="config.zContent"></div>
      }
    </main>

    @if (!config.zHideFooter) {
      <footer data-slot="sheet-footer" class="mt-auto flex flex-col gap-2 p-4">
        @if (config.zOkText !== null) {
          <button
            data-testid="z-ok-button"
            class="cursor-pointer"
            z-button
            [zType]="config.zOkDestructive ? 'destructive' : 'default'"
            [disabled]="config.zOkDisabled"
            (click)="onOkClick()"
          >
            @if (config.zOkIcon) {
              <z-icon [zType]="config.zOkIcon" />
            }

            {{ config.zOkText ?? 'OK' }}
          </button>
        }

        @if (config.zCancelText !== null) {
          <button data-testid="z-cancel-button" class="cursor-pointer" z-button zType="outline" (click)="onCloseClick()">
            @if (config.zCancelIcon) {
              <z-icon [zType]="config.zCancelIcon" />
            }

            {{ config.zCancelText ?? 'Cancel' }}
          </button>
        }
      </footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sheet',
    '[class]': 'classes()',
    '[attr.data-state]': 'state()',
    '[style.width]': 'config.zWidth ? config.zWidth + " !important" : null',
    '[style.height]': 'config.zHeight ? config.zHeight + " !important" : null',
  },
})
export class ZardSheetComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardSheetOptions<T, U>);

  protected readonly classes = computed(() => {
    const zSize = this.config.zWidth || this.config.zHeight ? 'custom' : this.config.zSize;

    return mergeClasses(
      sheetVariants({
        zSide: this.config.zSide,
        zSize,
      }),
      this.config.zCustomClasses,
    );
  });
  public sheetRef?: ZardSheetRef<T>;

  protected readonly isStringContent = typeof this.config.zContent === 'string';

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();
  readonly state = signal<'closed' | 'open'>('closed');

  constructor() {
    super();
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet()?.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet()?.hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }

    return this.portalOutlet()?.attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCloseClick() {
    this.cancelTriggered.emit();
  }
}

```



```angular-ts title="sheet.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      zSide: {
        right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 border-l',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 border-r',
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
      },
      zSize: {
        default: '',
        sm: '',
        lg: '',
        custom: '',
      },
    },
    compoundVariants: [
      {
        zSide: ['left', 'right'],
        zSize: 'default',
        class: 'w-3/4 sm:max-w-sm h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'sm',
        class: 'w-1/2 sm:max-w-xs h-full',
      },
      {
        zSide: ['left', 'right'],
        zSize: 'lg',
        class: 'w-full sm:max-w-lg h-full',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'default',
        class: 'h-auto',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'sm',
        class: 'h-1/3',
      },
      {
        zSide: ['top', 'bottom'],
        zSize: 'lg',
        class: 'h-3/4',
      },
    ],
    defaultVariants: {
      zSide: 'right',
      zSize: 'default',
    },
  },
);
export type ZardSheetVariants = VariantProps<typeof sheetVariants>;

```



```angular-ts title="sheet-ref.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, Inject, PLATFORM_ID } from '@angular/core';

import type { ZardSheetComponent, ZardSheetOptions } from './sheet.component';

const enum eTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok',
}

export class ZardSheetRef<T = any, R = any, U = any> {
  private destroy$ = new Subject<void>();
  private isClosing = false;
  protected result?: R;
  componentInstance: T | null = null;

  constructor(
    private overlayRef: OverlayRef,
    private config: ZardSheetOptions<T, U>,
    private containerInstance: ZardSheetComponent<T, U>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.containerInstance.cancelTriggered.subscribe(() => this.trigger(eTriggerAction.CANCEL));
    this.containerInstance.okTriggered.subscribe(() => this.trigger(eTriggerAction.OK));

    if ((this.config.zMaskClosable ?? true) && isPlatformBrowser(this.platformId)) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.close());
    }

    if (isPlatformBrowser(this.platformId)) {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          filter(event => event.key === 'Escape'),
          takeUntil(this.destroy$),
        )
        .subscribe(() => this.close());
    }
  }

  close(result?: R) {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.result = result;
    this.containerInstance.state.set('closed');

    const element = this.containerInstance.getNativeElement();
    const onAnimationEnd = () => {
      element.removeEventListener('animationend', onAnimationEnd);

      if (this.overlayRef) {
        if (this.overlayRef.hasAttached()) {
          this.overlayRef.detachBackdrop();
        }
        this.overlayRef.dispose();
      }

      if (!this.destroy$.closed) {
        this.destroy$.next();
        this.destroy$.complete();
      }
    };

    element.addEventListener('animationend', onAnimationEnd);

    setTimeout(() => {
      onAnimationEnd();
    }, 300);
  }

  private trigger(action: eTriggerAction) {
    const trigger = { ok: this.config.zOnOk, cancel: this.config.zOnCancel }[action];

    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent()) as R;
      this.closeWithResult(result);
    } else this.close();
  }

  private getContentComponent(): T {
    return this.componentInstance as T;
  }

  private closeWithResult(result: R): void {
    if (result !== false) this.close(result);
  }
}

```



```angular-ts title="sheet.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardButtonComponent } from '../button/button.component';
import { ZardSheetComponent } from './sheet.component';
import { ZardSheetService } from './sheet.service';

const components = [CommonModule, ZardButtonComponent, ZardSheetComponent, OverlayModule, PortalModule];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}

@NgModule({
  imports: [CommonModule, ZardButtonComponent, ZardSheetComponent, OverlayModule, PortalModule],
  providers: [ZardSheetService],
})
export class ZardSheetModule {}

```



```angular-ts title="sheet.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { inject, Injectable, InjectionToken, Injector, PLATFORM_ID, TemplateRef } from '@angular/core';
import { type ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';

import { ZardSheetComponent, ZardSheetOptions } from './sheet.component';
import { ZardSheetRef } from './sheet-ref';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
export const Z_MODAL_DATA = new InjectionToken<any>('Z_MODAL_DATA');

@Injectable({
  providedIn: 'root',
})
export class ZardSheetService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  create<T, U>(config: ZardSheetOptions<T, U>): ZardSheetRef<T> {
    return this.open<T, U>(config.zContent as ComponentType<T>, config);
  }

  private open<T, U>(componentOrTemplateRef: ContentType<T>, config: ZardSheetOptions<T, U>) {
    const overlayRef = this.createOverlay();

    if (!overlayRef) {
      // Return a mock sheet ref for SSR environments
      return new ZardSheetRef(undefined as any, config, undefined as any, this.platformId);
    }

    const sheetContainer = this.attachSheetContainer<T, U>(overlayRef, config);

    const sheetRef = this.attachSheetContent<T, U>(componentOrTemplateRef, sheetContainer, overlayRef, config);
    sheetContainer.sheetRef = sheetRef;

    return sheetRef;
  }

  private createOverlay(): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const overlayConfig = new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global(),
      });

      return this.overlay.create(overlayConfig);
    }
    return undefined;
  }

  private attachSheetContainer<T, U>(overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ZardSheetOptions, useValue: config },
      ],
    });

    const containerPortal = new ComponentPortal<ZardSheetComponent<T, U>>(ZardSheetComponent, config.zViewContainerRef, injector);
    const containerRef = overlayRef.attach<ZardSheetComponent<T, U>>(containerPortal);
    containerRef.instance.state.set('open');

    return containerRef.instance;
  }

  private attachSheetContent<T, U>(componentOrTemplateRef: ContentType<T>, sheetContainer: ZardSheetComponent<T, U>, overlayRef: OverlayRef, config: ZardSheetOptions<T, U>) {
    const sheetRef = new ZardSheetRef<T>(overlayRef, config, sheetContainer, this.platformId);

    if (componentOrTemplateRef instanceof TemplateRef) {
      sheetContainer.attachTemplatePortal(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          sheetRef: sheetRef,
        } as any),
      );
    } else if (typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T, U>(sheetRef, config);
      const contentRef = sheetContainer.attachComponentPortal<T>(new ComponentPortal(componentOrTemplateRef, config.zViewContainerRef, injector));
      sheetRef.componentInstance = contentRef.instance;
    }

    return sheetRef;
  }

  private createInjector<T, U>(sheetRef: ZardSheetRef<T>, config: ZardSheetOptions<T, U>) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ZardSheetRef, useValue: sheetRef },
        { provide: Z_MODAL_DATA, useValue: config.zData },
      ],
    });
  }
}

```

