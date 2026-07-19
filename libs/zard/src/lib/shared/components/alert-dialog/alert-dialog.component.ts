import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  type ComponentPortal,
  PortalModule,
  type TemplatePortal,
} from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  ElementRef,
  type EmbeddedViewRef,
  type EventEmitter,
  inject,
  NgModule,
  output,
  type TemplateRef,
  type Type,
  viewChild,
  type ViewContainerRef,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardAlertDialogRef } from './alert-dialog-ref';
import { ZardAlertDialogService } from './alert-dialog.service';
import {
  alertDialogDescriptionVariants,
  alertDialogFooterVariants,
  alertDialogHeaderVariants,
  alertDialogMediaVariants,
  alertDialogTitleVariants,
  alertDialogVariants,
  type ZardAlertDialogSizeVariants,
} from './alert-dialog.variants';
import { ZardButtonComponent } from '../button/button.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;

export class ZardAlertDialogOptions<T> {
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: object;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 100 (matches CSS transition). */
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
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-alert-dialog',
  imports: [A11yModule, NgTemplateOutlet, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective],
  template: `
    <ng-container zardId="z-alert-dialog" #idRef="zardId">
      @if (config.zMedia || config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="alert-dialog-header">
          @if (config.zMedia) {
            <div data-slot="alert-dialog-media" [class]="mediaClasses()">
              <ng-container [ngTemplateOutlet]="config.zMedia" />
            </div>
          }

          @if (config.zTitle) {
            <h2
              data-testid="z-alert-title"
              data-slot="alert-dialog-title"
              [class]="titleClasses()"
              [id]="idRef.id() + '-title'"
            >
              {{ config.zTitle }}
            </h2>
          }

          @if (config.zDescription) {
            <!-- Angular auto-sanitizes [innerHTML]; safe inline links/markup are preserved. -->
            <p
              data-testid="z-alert-description"
              data-slot="alert-dialog-description"
              [class]="descriptionClasses()"
              [id]="idRef.id() + '-description'"
              [innerHTML]="config.zDescription"
            ></p>
          }
        </header>
      }

      <main class="flex flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-alert-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      <footer [class]="footerClasses()" data-slot="alert-dialog-footer">
        @if (config.zCancelText !== null) {
          <button type="button" data-testid="z-alert-cancel-button" z-button zType="outline" (click)="onCancelClick()">
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
            (click)="onOkClick()"
          >
            {{ config.zOkText || 'Continue' }}
          </button>
        }
      </footer>
    </ng-container>
  `,
  styles: `
    :host {
      --z-alert-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-alert-dialog-duration) ease-out,
        transform var(--z-alert-dialog-duration) ease-out;
    }

    @starting-style {
      :host {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    :host.alert-dialog-leave {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-alert-dialog-duration) ease-in,
        transform var(--z-alert-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.--z-alert-dialog-duration]': 'durationCss()',
    '[attr.data-size]': 'size()',
    'data-slot': 'alert-dialog-content',
    role: 'alertdialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zAlertDialog',
})
export class ZardAlertDialogComponent<T> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardAlertDialogOptions<T>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly size = computed<ZardAlertDialogSizeVariants>(() => this.config.zSize ?? 'default');
  protected readonly classes = computed(() =>
    mergeClasses(alertDialogVariants({ zSize: this.size() }), this.config.zCustomClasses),
  );

  protected readonly headerClasses = computed(() => alertDialogHeaderVariants());
  protected readonly titleClasses = computed(() => alertDialogTitleVariants());
  protected readonly descriptionClasses = computed(() => alertDialogDescriptionVariants());
  protected readonly footerClasses = computed(() => alertDialogFooterVariants());
  protected readonly mediaClasses = computed(() => mergeClasses(alertDialogMediaVariants(), this.config.zMediaClass));
  protected readonly isStringContent = computed(() => typeof this.config.zContent === 'string');
  protected readonly titleId = computed(() => (this.config.zTitle ? `${this.idRef().id()}-title` : null));
  protected readonly descriptionId = computed(() =>
    this.config.zDescription ? `${this.idRef().id()}-description` : null,
  );

  protected readonly durationCss = computed(() =>
    this.config.zDuration !== undefined ? `${this.config.zDuration}ms` : null,
  );

  alertDialogRef?: ZardAlertDialogRef<T>;

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();

  getNativeElement(): HTMLElement {
    return this.host.nativeElement;
  }

  attachComponentPortal<C>(portal: ComponentPortal<C>): ComponentRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet().attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this.portalOutlet().hasAttached()) {
      throw new Error('Attempting to attach alert dialog content after content is already attached');
    }
    return this.portalOutlet().attachTemplatePortal(portal);
  }

  onOkClick() {
    this.okTriggered.emit();
  }

  onCancelClick() {
    this.cancelTriggered.emit();
  }
}

@NgModule({
  imports: [ZardButtonComponent, ZardAlertDialogComponent, OverlayModule, PortalModule, A11yModule],
  providers: [ZardAlertDialogService],
})
export class ZardAlertDialogModule {}
