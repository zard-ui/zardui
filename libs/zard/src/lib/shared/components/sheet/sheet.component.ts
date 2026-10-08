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

import { nextSheetId, ZardSheetHost } from './sheet-host';
import {
  SHEET_DURATION,
  ZardSheetPanelComponent,
  type ZardSheetSide,
  type ZardSheetSize,
} from './sheet-panel.component';
import {
  SHEET_BACKDROP_CLASSES,
  sheetDescriptionVariants,
  sheetFooterVariants,
  sheetHeaderVariants,
  sheetTitleVariants,
} from './sheet.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A panel that slides in from an edge of the screen, composed in the template.
 *
 * ```html
 * <z-sheet [(zVisible)]="visible" zSide="right">
 *   <z-sheet-header>
 *     <z-sheet-title>Title</z-sheet-title>
 *     <z-sheet-description>Description</z-sheet-description>
 *   </z-sheet-header>
 *   ...content...
 *   <z-sheet-footer>
 *     <button type="button" z-button z-sheet-close>Cancel</button>
 *   </z-sheet-footer>
 * </z-sheet>
 * ```
 *
 * `ZardSheetService.create()` opens the same panel from code.
 */
@Component({
  selector: 'z-sheet',
  imports: [ZardSheetPanelComponent],
  template: `
    <ng-template #panel>
      <z-sheet-panel
        [zSide]="zSide()"
        [zSize]="zSize()"
        [zWidth]="zWidth()"
        [zHeight]="zHeight()"
        [zClosable]="zClosable()"
        [zDuration]="zDuration()"
        [zState]="state()"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-sheet-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardSheetComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardSheetHost, useExisting: forwardRef(() => ZardSheetComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zSheet',
})
export class ZardSheetComponent extends ZardSheetHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Edge of the screen the sheet slides from. */
  readonly zSide = input<ZardSheetSide>('right');
  /** Preset width (left/right) or height (top/bottom). Ignored once `zWidth` or `zHeight` is set. */
  readonly zSize = input<ZardSheetSize>('default');
  /** Explicit width, for left/right sheets. */
  readonly zWidth = input<string | undefined>(undefined);
  /** Explicit height, for top/bottom sheets. */
  readonly zHeight = input<string | undefined>(undefined);
  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Whether a click on the mask closes the sheet. */
  readonly zMaskClosable = input(true, { transform: booleanAttribute });
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(SHEET_DURATION);
  /** Custom classes applied to the panel. */
  readonly class = input<ClassValue>('');

  /** Emitted once the sheet is attached to the DOM. */
  readonly zAfterOpen = output<void>();
  /** Emitted once the sheet has finished its exit transition and is gone. */
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
        backdropClass: SHEET_BACKDROP_CLASSES,
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
  selector: 'z-sheet-header, [z-sheet-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sheet-header',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetHeader',
})
export class ZardSheetHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sheetHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-sheet-title, [z-sheet-title]',
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
    'data-slot': 'sheet-title',
    role: 'heading',
    'aria-level': '2',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetTitle',
})
export class ZardSheetTitleComponent {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextSheetId('title');
  protected readonly classes = computed(() => mergeClasses(sheetTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.sheet?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.sheet?.titleId() === this.id) {
        this.sheet.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-sheet-description, [z-sheet-description]',
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
    'data-slot': 'sheet-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetDescription',
})
export class ZardSheetDescriptionComponent {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextSheetId('description');
  protected readonly classes = computed(() => mergeClasses(sheetDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.sheet?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.sheet?.descriptionId() === this.id) {
        this.sheet.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-sheet-footer, [z-sheet-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sheet-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zSheetFooter',
})
export class ZardSheetFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sheetFooterVariants(), this.class()));
}

/** Closes the sheet it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-sheet-close]',
  host: {
    'data-slot': 'sheet-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zSheetClose',
})
export class ZardSheetCloseDirective {
  private readonly sheet = inject(ZardSheetHost, { optional: true });

  protected onClick(): void {
    this.sheet?.requestClose();
  }
}
