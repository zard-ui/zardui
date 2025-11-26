import { OverlayModule } from '@angular/cdk/overlay';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  type ComponentPortal,
  PortalModule,
  type TemplatePortal,
} from '@angular/cdk/portal';
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

import { ZardButtonComponent } from '@ngzard/ui/button';
import { mergeClasses, noopFun } from '@ngzard/ui/core';
import { ZardIconComponent } from '@ngzard/ui/icon';
import type { ZardIcon } from '@ngzard/ui/icon';

import type { ZardSheetRef } from './sheet-ref';
import { sheetVariants, type ZardSheetVariants } from './sheet.variants';

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
  imports: [OverlayModule, PortalModule, ZardButtonComponent, ZardIconComponent],
  template: `
    @if (config.zClosable || config.zClosable === undefined) {
      <button
        type="button"
        data-testid="z-close-header-button"
        z-button
        zType="ghost"
        zSize="sm"
        class="absolute top-1 right-1 cursor-pointer"
        (click)="onCloseClick()"
      >
        <z-icon zType="x" />
      </button>
    }

    @if (config.zTitle || config.zDescription) {
      <header data-slot="sheet-header" class="flex flex-col gap-1.5 p-4">
        @if (config.zTitle) {
          <h4 data-testid="z-title" data-slot="sheet-title" class="text-lg leading-none font-semibold tracking-tight">
            {{ config.zTitle }}
          </h4>

          @if (config.zDescription) {
            <p data-testid="z-description" data-slot="sheet-description" class="text-muted-foreground text-sm">
              {{ config.zDescription }}
            </p>
          }
        }
      </header>
    }

    <main class="flex w-full flex-col space-y-4">
      <ng-template cdkPortalOutlet />

      @if (isStringContent) {
        <div data-testid="z-content" data-slot="sheet-content" [innerHTML]="config.zContent"></div>
      }
    </main>

    @if (!config.zHideFooter) {
      <footer data-slot="sheet-footer" class="mt-auto flex flex-col gap-2 p-4">
        @if (config.zOkText !== null) {
          <button
            type="button"
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
          <button
            type="button"
            data-testid="z-cancel-button"
            class="cursor-pointer"
            z-button
            zType="outline"
            (click)="onCloseClick()"
          >
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
  exportAs: 'zSheet',
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

  sheetRef?: ZardSheetRef<T>;

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
