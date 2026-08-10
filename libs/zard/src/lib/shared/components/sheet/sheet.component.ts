import { A11yModule } from '@angular/cdk/a11y';
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
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardSheetRef } from './sheet-ref';
import {
  sheetDescriptionVariants,
  sheetFooterVariants,
  sheetHeaderVariants,
  sheetTitleVariants,
  sheetVariants,
  type ZardSheetVariants,
} from './sheet.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardSheetOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 200 (matches CSS transition). */
  zDuration?: number;
  zHeight?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zSide?: ZardSheetVariants['zSide'] = 'right';
  zSize?: ZardSheetVariants['zSize'] = 'default';
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-sheet',
  imports: [A11yModule, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective, NgIcon],
  template: `
    <ng-container zardId="z-sheet" #idRef="zardId">
      @if (config.zClosable || config.zClosable === undefined) {
        <button
          type="button"
          data-testid="z-close-header-button"
          data-slot="sheet-close"
          z-button
          zType="ghost"
          zSize="icon-sm"
          class="absolute top-3 right-3"
          (click)="onCloseClick()"
        >
          <ng-icon name="lucideX" class="size-4!" />
          <span class="sr-only">Close</span>
        </button>
      }

      @if (config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="sheet-header">
          @if (config.zTitle) {
            <h4 data-testid="z-title" data-slot="sheet-title" [class]="titleClasses()" [id]="idRef.id() + '-title'">
              {{ config.zTitle }}
            </h4>

            @if (config.zDescription) {
              <p
                data-testid="z-description"
                data-slot="sheet-description"
                [class]="descriptionClasses()"
                [id]="idRef.id() + '-description'"
              >
                {{ config.zDescription }}
              </p>
            }
          }
        </header>
      }

      <!-- min-h-0 lets the content area shrink below its intrinsic height, so scrollable
           content stays inside the sheet instead of pushing the footer past the viewport. -->
      <main class="flex min-h-0 w-full flex-1 flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <footer [class]="footerClasses()" data-slot="sheet-footer">
          @if (config.zOkText !== null) {
            <button
              type="button"
              data-testid="z-ok-button"
              z-button
              [zType]="config.zOkDestructive ? 'destructive' : 'default'"
              [zDisabled]="config.zOkDisabled"
              (click)="onOkClick()"
            >
              @if (config.zOkIcon) {
                @if (isSvgString(config.zOkIcon)) {
                  <ng-icon [svg]="config.zOkIcon" class="size-4!" />
                } @else {
                  <ng-icon [name]="config.zOkIcon" class="size-4!" />
                }
              }

              {{ config.zOkText ?? 'OK' }}
            </button>
          }

          @if (config.zCancelText !== null) {
            <button type="button" data-testid="z-cancel-button" z-button zType="outline" (click)="onCloseClick()">
              @if (config.zCancelIcon) {
                @if (isSvgString(config.zCancelIcon)) {
                  <ng-icon [svg]="config.zCancelIcon" class="size-4!" />
                } @else {
                  <ng-icon [name]="config.zCancelIcon" class="size-4!" />
                }
              }

              {{ config.zCancelText ?? 'Cancel' }}
            </button>
          }
        </footer>
      }
    </ng-container>
  `,
  styles: `
    :host {
      --z-sheet-duration: 200ms;
      opacity: 1;
      translate: 0 0;
      transition:
        opacity var(--z-sheet-duration) ease-in-out,
        translate var(--z-sheet-duration) ease-in-out;
    }

    @starting-style {
      :host([data-side='right']) {
        opacity: 0;
        translate: 2.5rem 0;
      }

      :host([data-side='left']) {
        opacity: 0;
        translate: -2.5rem 0;
      }

      :host([data-side='top']) {
        opacity: 0;
        translate: 0 -2.5rem;
      }

      :host([data-side='bottom']) {
        opacity: 0;
        translate: 0 2.5rem;
      }
    }

    :host(.sheet-leave[data-side='right']) {
      opacity: 0;
      translate: 2.5rem 0;
    }

    :host(.sheet-leave[data-side='left']) {
      opacity: 0;
      translate: -2.5rem 0;
    }

    :host(.sheet-leave[data-side='top']) {
      opacity: 0;
      translate: 0 -2.5rem;
    }

    :host(.sheet-leave[data-side='bottom']) {
      opacity: 0;
      translate: 0 2.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'sheet-content',
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.height]': 'config.zHeight ? config.zHeight : null',
    '[style.--z-sheet-duration]': 'durationCss()',
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zSheet',
})
export class ZardSheetComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardSheetOptions<T, U>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly side = computed(() => this.config.zSide ?? 'right');

  protected readonly classes = computed(() => {
    const zSize = this.config.zWidth || this.config.zHeight ? 'custom' : this.config.zSize;

    return mergeClasses(sheetVariants({ zSide: this.side(), zSize }), this.config.zCustomClasses);
  });

  protected readonly headerClasses = computed(() => sheetHeaderVariants());
  protected readonly titleClasses = computed(() => sheetTitleVariants());
  protected readonly descriptionClasses = computed(() => sheetDescriptionVariants());
  protected readonly footerClasses = computed(() => sheetFooterVariants());
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.idRef().id()}-title` : null));
  protected readonly descriptionId = computed(() =>
    this.config.zDescription ? `${this.idRef().id()}-description` : null,
  );

  protected readonly durationCss = computed(() =>
    this.config.zDuration !== undefined ? `${this.config.zDuration}ms` : null,
  );

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  sheetRef?: ZardSheetRef<T>;

  constructor() {
    super();

    // Set in the constructor rather than through a host binding: the CDK appends this element to the
    // DOM before the first change detection runs, and `@starting-style` only applies to the very
    // first style resolution — a late `data-side` would silently skip the enter animation.
    this.host.nativeElement.setAttribute('data-side', this.side());
  }

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }

    return this.portalOutlet().attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCloseClick() {
    this.cancelTriggered.emit();
  }
}
