import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  type EventEmitter,
  forwardRef,
  inject,
  output,
  signal,
  type TemplateRef,
  type ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { noopFn } from '@/shared/utils/noop';

import { ZardAlertDialogHost } from './alert-dialog-host';
import { ALERT_DIALOG_DURATION, ZardAlertDialogPanelComponent } from './alert-dialog-panel.component';
import type { ZardAlertDialogRef } from './alert-dialog-ref';
import {
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
} from './alert-dialog.component';
import type { ZardAlertDialogSizeVariants } from './alert-dialog.variants';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zCustomClasses?: ClassValue;
  zData?: object;
  /** Description text. Inline markup (a link, emphasis) is rendered; scripts and handlers are stripped. */
  zDescription?: string;
  /** Animation duration (ms) used when opening and closing. Defaults to 100 (matches CSS transition). */
  zDuration?: number;
  zMaskClosable?: boolean;
  /**
   * Optional template rendered as a media slot above the title (e.g. an icon).
   * When present, the header layout adapts to align media + title side-by-side
   * on `default` size at sm breakpoint.
   */
  zMedia?: TemplateRef<void>;
  /** Extra classes applied to the media slot wrapper (e.g. tinted backgrounds for destructive). */
  zMediaClass?: ClassValue;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  /** Visual size of the dialog. `default` is wider on sm+; `sm` keeps the compact width. */
  zSize?: ZardAlertDialogSizeVariants;
  zTitle?: string | TemplateRef<void>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

/**
 * What `ZardAlertDialogService.create()` attaches to the overlay: the shared
 * `z-alert-dialog-panel` with a header and a footer built from the options.
 *
 * @internal Open alert dialogs through the service; compose `z-alert-dialog` for the declarative form.
 */
@Component({
  selector: 'z-alert-dialog-container',
  imports: [
    NgTemplateOutlet,
    ZardButtonComponent,
    ZardAlertDialogPanelComponent,
    ZardAlertDialogHeaderComponent,
    ZardAlertDialogMediaComponent,
    ZardAlertDialogTitleComponent,
    ZardAlertDialogDescriptionComponent,
    ZardAlertDialogFooterComponent,
  ],
  template: `
    <z-alert-dialog-panel
      [zSize]="config.zSize ?? 'default'"
      [zWidth]="config.zWidth"
      [zDuration]="duration()"
      [zState]="state()"
      [zLabelledBy]="titleId()"
      [zDescribedBy]="descriptionId()"
      [class]="config.zCustomClasses"
    >
      @if (config.zMedia || config.zTitle || config.zDescription) {
        <z-alert-dialog-header>
          @if (config.zMedia) {
            <z-alert-dialog-media [class]="config.zMediaClass">
              <ng-container [ngTemplateOutlet]="config.zMedia" />
            </z-alert-dialog-media>
          }

          @if (config.zTitle) {
            <z-alert-dialog-title data-testid="z-alert-title" [zTitle]="config.zTitle" />
          }

          @if (config.zDescription) {
            <!-- Angular auto-sanitizes [innerHTML]; safe inline links/markup are preserved. -->
            <z-alert-dialog-description data-testid="z-alert-description">
              <span [innerHTML]="config.zDescription"></span>
            </z-alert-dialog-description>
          }
        </z-alert-dialog-header>
      }

      <z-alert-dialog-footer>
        @if (config.zCancelText !== null) {
          <button
            type="button"
            data-testid="z-alert-cancel-button"
            z-button
            zType="outline"
            (click)="cancelTriggered.emit()"
          >
            {{ config.zCancelText || 'Cancel' }}
          </button>
        }
        @if (config.zOkText !== null) {
          <button
            type="button"
            data-testid="z-alert-ok-button"
            z-button
            [zType]="config.zOkDestructive ? 'destructive' : 'default'"
            [zDisabled]="config.zOkDisabled"
            (click)="okTriggered.emit()"
          >
            {{ config.zOkText || 'Continue' }}
          </button>
        }
      </z-alert-dialog-footer>
    </z-alert-dialog-panel>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardAlertDialogContainerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardAlertDialogHost, useExisting: forwardRef(() => ZardAlertDialogContainerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zAlertDialogContainer',
})
export class ZardAlertDialogContainerComponent<T> implements ZardAlertDialogHost {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly config = inject(ZardAlertDialogOptions<T>);

  readonly okTriggered = output<void>();
  readonly cancelTriggered = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = computed(() => this.config.zDuration ?? ALERT_DIALOG_DURATION);

  alertDialogRef?: ZardAlertDialogRef<T>;

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
}
