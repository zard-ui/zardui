import { Overlay, OverlayConfig, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  untracked,
  ViewContainerRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { nextAlertDialogId, ZardAlertDialogHost } from './alert-dialog-host';
import { ALERT_DIALOG_DURATION, ZardAlertDialogPanelComponent } from './alert-dialog-panel.component';
import {
  ALERT_DIALOG_BACKDROP_CLASSES,
  alertDialogDescriptionVariants,
  alertDialogFooterVariants,
  alertDialogHeaderVariants,
  alertDialogMediaVariants,
  alertDialogTitleVariants,
  type ZardAlertDialogSizeVariants,
} from './alert-dialog.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A modal that interrupts the user with a decision, composed in the template.
 *
 * ```html
 * <z-alert-dialog [(zVisible)]="visible">
 *   <z-alert-dialog-header>
 *     <z-alert-dialog-media><ng-icon name="lucideTrash2" /></z-alert-dialog-media>
 *     <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
 *     <z-alert-dialog-description>This cannot be undone.</z-alert-dialog-description>
 *   </z-alert-dialog-header>
 *   <z-alert-dialog-footer>
 *     <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
 *     <button type="button" z-button zType="destructive" (click)="remove()">Delete</button>
 *   </z-alert-dialog-footer>
 * </z-alert-dialog>
 * ```
 *
 * `ZardAlertDialogService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-alert-dialog',
  imports: [ZardAlertDialogPanelComponent],
  template: `
    <ng-template #panel>
      <z-alert-dialog-panel
        [zSize]="zSize()"
        [zWidth]="zWidth()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
      >
        <ng-content />
      </z-alert-dialog-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardAlertDialogComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardAlertDialogHost, useExisting: forwardRef(() => ZardAlertDialogComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zAlertDialog',
})
export class ZardAlertDialogComponent extends ZardAlertDialogHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Visual size. `default` widens on sm+ and lays media and title side by side; `sm` stays compact and centered. */
  readonly zSize = input<ZardAlertDialogSizeVariants>('default');
  /** Explicit width; leave unset for the size preset. */
  readonly zWidth = input<string | undefined>(undefined);
  /** Whether a click on the mask closes the alert dialog. Off by default: the user has to decide. */
  readonly zMaskClosable = input(false, { transform: booleanAttribute });
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(ALERT_DIALOG_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the alert dialog is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the alert dialog has finished its exit transition and is gone. */
  readonly zAfterClose = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');

  private overlayRef: OverlayRef | null = null;
  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private destroyed = false;

  constructor() {
    super();

    effect(() => {
      const visible = this.zVisible();
      untracked(() => (visible ? this.open() : this.startClose()));
    });

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.dispose();
    });
  }

  requestClose(): void {
    this.zVisible.set(false);
  }

  private open(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Re-opening mid-exit: keep the same overlay and reverse the transition.
    if (this.overlayRef) {
      this.clearDisposeTimer();
      this.state.set('open');
      return;
    }

    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.state.set('open');

    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: ALERT_DIALOG_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
        disposeOnNavigation: true,
      }),
    );
    this.overlayRef = overlayRef;

    overlayRef.attach(new TemplatePortal(this.panel(), this.viewContainerRef));

    overlayRef.backdropClick().subscribe(() => {
      if (this.zMaskClosable()) {
        this.requestClose();
      }
    });
    overlayRef
      .keydownEvents()
      .pipe(filter(event => ESCAPE_KEYS.includes(event.key)))
      .subscribe(event => {
        event.preventDefault();
        this.requestClose();
      });

    this.zAfterOpen.emit();
  }

  private startClose(): void {
    if (!this.overlayRef || this.disposeTimer !== null) {
      return;
    }

    this.state.set('closed');
    this.overlayRef.detachBackdrop();
    this.disposeTimer = setTimeout(() => this.dispose(), this.zDuration());
  }

  private dispose(): void {
    this.clearDisposeTimer();
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.dispose();
    this.overlayRef = null;

    if (this.previouslyFocused?.isConnected) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;

    // Teardown disposes the overlay too, but the output is already gone by then.
    if (!this.destroyed) {
      this.zAfterClose.emit();
    }
  }

  private clearDisposeTimer(): void {
    if (this.disposeTimer === null) {
      return;
    }

    clearTimeout(this.disposeTimer);
    this.disposeTimer = null;
  }
}

@Component({
  selector: 'z-alert-dialog-header, [z-alert-dialog-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-header',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogHeader',
})
export class ZardAlertDialogHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogHeaderVariants(), this.class()));
}

/** Media slot above the title, usually an icon. The header lays it next to the title on `default` size. */
@Component({
  selector: 'z-alert-dialog-media, [z-alert-dialog-media]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-media',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogMedia',
})
export class ZardAlertDialogMediaComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogMediaVariants(), this.class()));
}

@Component({
  selector: 'z-alert-dialog-title, [z-alert-dialog-title]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let title = zTitle();
    <ng-container *zStringTemplateOutlet="title">
      {{ title }}
      <ng-content />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogTitle',
})
export class ZardAlertDialogTitleComponent {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextAlertDialogId('title');
  protected readonly classes = computed(() => mergeClasses(alertDialogTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.alertDialog?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.alertDialog?.titleId() === this.id) {
        this.alertDialog.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-alert-dialog-description, [z-alert-dialog-description]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let description = zDescription();
    <ng-container *zStringTemplateOutlet="description">
      {{ description }}
      <ng-content />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogDescription',
})
export class ZardAlertDialogDescriptionComponent {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextAlertDialogId('description');
  protected readonly classes = computed(() => mergeClasses(alertDialogDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.alertDialog?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.alertDialog?.descriptionId() === this.id) {
        this.alertDialog.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-alert-dialog-footer, [z-alert-dialog-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zAlertDialogFooter',
})
export class ZardAlertDialogFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogFooterVariants(), this.class()));
}

/** Closes the alert dialog it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-alert-dialog-close]',
  host: {
    'data-slot': 'alert-dialog-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zAlertDialogClose',
})
export class ZardAlertDialogCloseDirective {
  private readonly alertDialog = inject(ZardAlertDialogHost, { optional: true });

  protected onClick(): void {
    this.alertDialog?.requestClose();
  }
}
