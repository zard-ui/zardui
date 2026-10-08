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
  Injector,
  output,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { noopFn } from '@/shared/utils/noop';

import { ZardSheetHost } from './sheet-host';
import { SHEET_DURATION, ZardSheetPanelComponent } from './sheet-panel.component';
import type { ZardSheetRef } from './sheet-ref';
import {
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
} from './sheet.component';
import type { ZardSheetVariants } from './sheet.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardSheetOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 200 (matches CSS transition). */
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
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardSheetService.create()` attaches to the overlay: the shared `z-sheet-panel`
 * with a header, the projected content and a footer built from the options.
 *
 * @internal Open sheets through the service; compose `z-sheet` for the declarative form.
 */
@Component({
  selector: 'z-sheet-container',
  imports: [
    PortalModule,
    NgIcon,
    ZardButtonComponent,
    ZardSheetPanelComponent,
    ZardSheetHeaderComponent,
    ZardSheetTitleComponent,
    ZardSheetDescriptionComponent,
    ZardSheetFooterComponent,
  ],
  template: `
    <z-sheet-panel
      [zSide]="config.zSide ?? 'right'"
      [zSize]="config.zSize ?? 'default'"
      [zWidth]="config.zWidth"
      [zHeight]="config.zHeight"
      [zClosable]="config.zClosable ?? true"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="cancelTriggered.emit()"
    >
      @if (config.zTitle || config.zDescription) {
        <z-sheet-header>
          @if (config.zTitle) {
            <z-sheet-title data-testid="z-title" [zTitle]="config.zTitle" />
          }
          @if (config.zDescription) {
            <z-sheet-description data-testid="z-description" [zDescription]="config.zDescription" />
          }
        </z-sheet-header>
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
        <z-sheet-footer>
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
        </z-sheet-footer>
      }
    </z-sheet-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardSheetContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardSheetHost, useExisting: forwardRef(() => ZardSheetContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zSheetContainer',
})
export class ZardSheetContainerComponent<T, U> extends BasePortalOutlet implements ZardSheetHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardSheetOptions<T, U>);

  /** Element injector of the container, the parent of the injector handed to the projected content. */
  readonly injector = inject(Injector);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? SHEET_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');

  sheetRef?: ZardSheetRef<T>;

  protected isSvgString(icon: string): boolean {
    return /^\s*<svg/i.test(icon);
  }

  requestClose(): void {
    this.cancelTriggered.emit();
  }

  /** Plays the exit transition. The ref disposes the overlay once it finishes. */
  leave(): void {
    this.state.set('closed');
  }

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
}
