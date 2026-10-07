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

import { ZardDialogHost } from './dialog-host';
import { DIALOG_DURATION, ZardDialogPanelComponent } from './dialog-panel.component';
import type { ZardDialogRef } from './dialog-ref';
import {
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
} from './dialog.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardDialogOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 100 (matches CSS transition). */
  zDuration?: number;
  zHideFooter?: boolean;
  /**
   * Keeps the title and description in the accessibility tree but out of the layout (`sr-only`),
   * the same trick shadcn uses when a dialog's content owns its own visual header.
   */
  zHideHeader?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardDialogService.create()` attaches to the overlay: the shared `z-dialog-panel`
 * with a header, the projected content and a footer built from the options.
 *
 * @internal Open dialogs through the service; compose `z-dialog` for the declarative form.
 */
@Component({
  selector: 'z-dialog-container',
  imports: [
    PortalModule,
    NgIcon,
    ZardButtonComponent,
    ZardDialogPanelComponent,
    ZardDialogHeaderComponent,
    ZardDialogTitleComponent,
    ZardDialogDescriptionComponent,
    ZardDialogFooterComponent,
  ],
  template: `
    <z-dialog-panel
      [zClosable]="config.zClosable ?? true"
      [zWidth]="config.zWidth"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
      (closeRequested)="cancelTriggered.emit()"
    >
      @if (config.zTitle || config.zDescription) {
        <z-dialog-header [class]="config.zHideHeader ? 'sr-only' : ''">
          @if (config.zTitle) {
            <z-dialog-title data-testid="z-title" [zTitle]="config.zTitle" />
          }
          @if (config.zDescription) {
            <z-dialog-description data-testid="z-description" [zDescription]="config.zDescription" />
          }
        </z-dialog-header>
      }

      <!-- display: contents makes the content a direct item of the panel grid, as it is in the
           declarative form: the panel gap spaces it, and an empty main adds no gap of its own. -->
      <main class="contents">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <z-dialog-footer>
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
        </z-dialog-footer>
      }
    </z-dialog-panel>
  `,
  // A component passed as zContent renders its own children inside its host, one level below the
  // panel grid. Giving that host the panel's grid and gap lays those children out as the
  // declarative form does. :where() in the components layer keeps it a default: any display or
  // gap utility on the host still wins.
  styles: `
    @layer components {
      :where(z-dialog-container [data-slot='dialog-body']) {
        display: grid;
        gap: calc(var(--spacing, 0.25rem) * 4);
      }
    }
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDialogContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDialogHost, useExisting: forwardRef(() => ZardDialogContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDialogContainer',
})
export class ZardDialogContainerComponent<T, U> extends BasePortalOutlet implements ZardDialogHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardDialogOptions<T, U>);

  /** Element injector of the container, the parent of the injector handed to the projected content. */
  readonly injector = inject(Injector);

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? DIALOG_DURATION);
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');

  dialogRef?: ZardDialogRef<T>;

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
    const componentRef = this.portalOutlet().attachComponentPortal(portal);
    const contentHost = componentRef.location.nativeElement as HTMLElement;
    if (!contentHost.hasAttribute('data-slot')) {
      contentHost.setAttribute('data-slot', 'dialog-body');
    }

    return componentRef;
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach modal content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }
}
