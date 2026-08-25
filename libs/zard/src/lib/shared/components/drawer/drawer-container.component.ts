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
  forwardRef,
  inject,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button';
import { noopFn } from '@/shared/utils/noop';

import { ZardDrawerHost } from './drawer-host';
import { ZardDrawerPanelComponent } from './drawer-panel.component';
import {
  ZardDrawerDescriptionComponent,
  ZardDrawerFooterComponent,
  ZardDrawerHeaderComponent,
  ZardDrawerTitleComponent,
} from './drawer.component';
import { DRAWER_DURATION, type ZardDrawerSnapPoint } from './drawer.utils';
import type { ZardDrawerPlacement } from './drawer.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

/** Configuration accepted by {@link ZardDrawerService.create}. */
export class ZardDrawerOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  /** Whether to show the close button in the corner. */
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string | TemplateRef<void>;
  /** Whether swipe, mask and Escape can close the drawer. */
  zDismissible?: boolean;
  /** Animation duration (ms) used when closing. Defaults to 450 (matches the CSS transition). */
  zDuration?: number;
  /** Renders the swipe handle. */
  zHandle?: boolean;
  zHideFooter?: boolean;
  /** Renders the backdrop and traps the page behind the drawer. Set false for a non-modal drawer. */
  zMask?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zPlacement?: ZardDrawerPlacement = 'bottom';
  zSnapPoint?: ZardDrawerSnapPoint;
  zSnapPoints?: readonly ZardDrawerSnapPoint[];
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
}

/**
 * Container the {@link ZardDrawerService} attaches to the overlay. It renders the
 * configured header, footer and content around the shared drawer panel.
 *
 * @internal
 */
@Component({
  selector: 'z-drawer-container',
  imports: [
    NgIcon,
    PortalModule,
    ZardButtonComponent,
    ZardDrawerDescriptionComponent,
    ZardDrawerFooterComponent,
    ZardDrawerHeaderComponent,
    ZardDrawerPanelComponent,
    ZardDrawerTitleComponent,
  ],
  template: `
    <z-drawer-panel
      [zPlacement]="placement()"
      [zSnapPoints]="config.zSnapPoints"
      [zSnapPoint]="snapPoint()"
      (zSnapPointChange)="snapPoint.set($event)"
      [zDismissible]="dismissible()"
      [zHandle]="config.zHandle"
      [zModal]="config.zMask ?? true"
      [zState]="state()"
      [zDuration]="duration()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="requestClose()"
    >
      <div class="relative flex min-h-0 w-full flex-1 flex-col">
        @if (config.zClosable ?? true) {
          <button
            type="button"
            data-testid="z-close-header-button"
            z-button
            zType="ghost"
            zSize="icon-sm"
            class="absolute top-3 right-3"
            (click)="cancelTriggered.emit()"
          >
            <ng-icon name="lucideX" class="size-4!" />
            <span class="sr-only">Close</span>
          </button>
        }

        @if (config.zTitle || config.zDescription) {
          <z-drawer-header>
            @if (config.zTitle) {
              <z-drawer-title data-testid="z-title" [zTitle]="config.zTitle" />
            }
            @if (config.zDescription) {
              <p z-drawer-description data-testid="z-description" [zDescription]="config.zDescription"></p>
            }
          </z-drawer-header>
        }

        <!-- min-h-0 lets the content area shrink below its intrinsic height, so scrollable
           content stays inside the drawer instead of pushing the footer past the viewport. -->
        <main [class]="contentClasses">
          <ng-template cdkPortalOutlet />

          @if (isStringContent()) {
            <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
            <div data-testid="z-content" [innerHTML]="config.zContent"></div>
          }
        </main>

        @if (!config.zHideFooter) {
          <z-drawer-footer>
            @if (config.zOkText !== null) {
              <button
                type="button"
                data-testid="z-ok-button"
                z-button
                [zType]="config.zOkDestructive ? 'destructive' : 'default'"
                [zDisabled]="config.zOkDisabled"
                (click)="okTriggered.emit()"
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
              <button
                type="button"
                data-testid="z-cancel-button"
                z-button
                zType="outline"
                (click)="cancelTriggered.emit()"
              >
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
          </z-drawer-footer>
        }
      </div>
    </z-drawer-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDrawerContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDrawerHost, useExisting: forwardRef(() => ZardDrawerContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: { style: 'display: contents' },
  exportAs: 'zDrawerContainer',
})
export class ZardDrawerContainerComponent<T, U> extends BasePortalOutlet implements ZardDrawerHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardDrawerOptions<T, U>);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>(this.config.zSnapPoint);

  protected readonly placement = computed(() => this.config.zPlacement ?? 'bottom');
  protected readonly dismissible = computed(() => this.config.zDismissible ?? true);
  protected readonly duration = computed(() => this.config.zDuration ?? DRAWER_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  /** The scroll region sits between the header and the footer, as shadcn's demos compose it. */
  protected readonly contentClasses = 'flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-4';

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  requestClose(): void {
    if (!this.dismissible()) {
      return;
    }
    this.cancelTriggered.emit();
  }

  /** Plays the exit animation. The ref disposes the overlay once it finishes. */
  leave(): void {
    this.state.set('closed');
  }

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach drawer content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach drawer content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }
}
