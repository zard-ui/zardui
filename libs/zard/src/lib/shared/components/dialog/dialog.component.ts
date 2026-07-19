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

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import type { ZardDialogRef } from './dialog-ref';
import {
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogVariants,
} from './dialog.variants';
import { ZardButtonComponent } from '../button/button.component';

export type OnClickCallback<T> = (instance: T) => false | void | object;
export class ZardDialogOptions<T, U> {
  zCancelIcon?: string;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: ClassValue;
  zData?: U;
  zDescription?: string;
  /** Animation duration (ms) used when closing. Defaults to 100 (matches CSS transition). */
  zDuration?: number;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: string;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFn;
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}

@Component({
  selector: 'z-dialog',
  imports: [A11yModule, OverlayModule, PortalModule, ZardButtonComponent, ZardIdDirective, NgIcon],
  template: `
    <ng-container zardId="z-dialog" #idRef="zardId">
      @if (config.zClosable || config.zClosable === undefined) {
        <button
          type="button"
          data-testid="z-close-header-button"
          data-slot="dialog-close"
          z-button
          zType="ghost"
          zSize="icon-sm"
          class="absolute top-2 right-2"
          (click)="onCloseClick()"
        >
          <ng-icon name="lucideX" class="size-4!" />
          <span class="sr-only">Close</span>
        </button>
      }

      @if (config.zTitle || config.zDescription) {
        <header [class]="headerClasses()" data-slot="dialog-header">
          @if (config.zTitle) {
            <h4 data-testid="z-title" data-slot="dialog-title" [class]="titleClasses()" [id]="idRef.id() + '-title'">
              {{ config.zTitle }}
            </h4>

            @if (config.zDescription) {
              <p
                data-testid="z-description"
                data-slot="dialog-description"
                [class]="descriptionClasses()"
                [id]="idRef.id() + '-description'"
              >
                {{ config.zDescription }}
              </p>
            }
          }
        </header>
      }

      <main class="flex flex-col space-y-4">
        <ng-template cdkPortalOutlet />

        @if (isStringContent()) {
          <!-- Angular auto-sanitizes [innerHTML] by default; scripts/event handlers are stripped. -->
          <div data-testid="z-content" [innerHTML]="config.zContent"></div>
        }
      </main>

      @if (!config.zHideFooter) {
        <footer [class]="footerClasses()" data-slot="dialog-footer">
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
        </footer>
      }
    </ng-container>
  `,
  styles: `
    :host {
      --z-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-dialog-duration) ease-out,
        transform var(--z-dialog-duration) ease-out;
    }

    @starting-style {
      :host {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    :host.dialog-leave {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-dialog-duration) ease-in,
        transform var(--z-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    '[class]': 'classes()',
    '[style.width]': 'config.zWidth ? config.zWidth : null',
    '[style.--z-dialog-duration]': 'durationCss()',
    'data-slot': 'dialog-content',
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    cdkTrapFocus: 'true',
    cdkTrapFocusAutoCapture: 'true',
  },
  exportAs: 'zDialog',
})
export class ZardDialogComponent<T, U> extends BasePortalOutlet {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly config = inject(ZardDialogOptions<T, U>);
  private readonly idRef = viewChild.required<ZardIdDirective>('idRef');

  protected readonly classes = computed(() => mergeClasses(dialogVariants(), this.config.zCustomClasses));
  protected readonly headerClasses = computed(() => dialogHeaderVariants());
  protected readonly titleClasses = computed(() => dialogTitleVariants());
  protected readonly descriptionClasses = computed(() => dialogDescriptionVariants());
  protected readonly footerClasses = computed(() => dialogFooterVariants());
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

  dialogRef?: ZardDialogRef<T>;

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  okTriggered = output<void>();
  cancelTriggered = output<void>();

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
