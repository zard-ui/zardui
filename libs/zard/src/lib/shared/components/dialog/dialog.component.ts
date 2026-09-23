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

import { nextDialogId, ZardDialogHost } from './dialog-host';
import { DIALOG_DURATION, ZardDialogPanelComponent } from './dialog-panel.component';
import {
  DIALOG_BACKDROP_CLASSES,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
} from './dialog.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A modal window layered over the page, composed in the template.
 *
 * ```html
 * <z-dialog [(zVisible)]="visible">
 *   <z-dialog-header>
 *     <z-dialog-title>Title</z-dialog-title>
 *     <z-dialog-description>Description</z-dialog-description>
 *   </z-dialog-header>
 *   ...content...
 *   <z-dialog-footer>
 *     <button type="button" z-button z-dialog-close>Cancel</button>
 *   </z-dialog-footer>
 * </z-dialog>
 * ```
 *
 * `ZardDialogService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-dialog',
  imports: [ZardDialogPanelComponent],
  template: `
    <ng-template #panel>
      <z-dialog-panel
        [zClosable]="zClosable()"
        [zWidth]="zWidth()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-dialog-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDialogComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDialogHost, useExisting: forwardRef(() => ZardDialogComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDialog',
})
export class ZardDialogComponent extends ZardDialogHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Whether a click on the mask closes the dialog. */
  readonly zMaskClosable = input(true, { transform: booleanAttribute });
  /** Explicit width; leave unset for the responsive default. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(DIALOG_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the dialog is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the dialog has finished its exit transition and is gone. */
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
        backdropClass: DIALOG_BACKDROP_CLASSES,
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
  selector: 'z-dialog-header, [z-dialog-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'dialog-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogHeader',
})
export class ZardDialogHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dialogHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-dialog-title, [z-dialog-title]',
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
    'data-slot': 'dialog-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogTitle',
})
export class ZardDialogTitleComponent {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextDialogId('title');
  protected readonly classes = computed(() => mergeClasses(dialogTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.dialog?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.dialog?.titleId() === this.id) {
        this.dialog.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-dialog-description, [z-dialog-description]',
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
    'data-slot': 'dialog-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogDescription',
})
export class ZardDialogDescriptionComponent {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextDialogId('description');
  protected readonly classes = computed(() => mergeClasses(dialogDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.dialog?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.dialog?.descriptionId() === this.id) {
        this.dialog.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-dialog-footer, [z-dialog-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'dialog-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zDialogFooter',
})
export class ZardDialogFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dialogFooterVariants(), this.class()));
}

/** Closes the dialog it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-dialog-close]',
  host: {
    'data-slot': 'dialog-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zDialogClose',
})
export class ZardDialogCloseDirective {
  private readonly dialog = inject(ZardDialogHost, { optional: true });

  protected onClick(): void {
    this.dialog?.requestClose();
  }
}
