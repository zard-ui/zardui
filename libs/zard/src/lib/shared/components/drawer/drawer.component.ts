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

import { nextDrawerId, ZardDrawerHost } from './drawer-host';
import { ZardDrawerPanelComponent } from './drawer-panel.component';
import { hasOpenDrawer } from './drawer-stack';
import { DRAWER_DURATION, type ZardDrawerSnapPoint } from './drawer.utils';
import {
  DRAWER_BACKDROP_CLASSES,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerTitleVariants,
  type ZardDrawerPlacement,
} from './drawer.variants';

const ESCAPE_KEYS = ['Escape', 'Esc'];

/**
 * A floating panel that slides in from an edge of the screen and can be swiped — flick it
 * away to dismiss, or drag it between snap points to peek and expand.
 *
 * Content is composed in the template, the same vocabulary the dialog uses:
 *
 * ```html
 * <z-drawer [(zVisible)]="visible">
 *   <z-drawer-header>
 *     <z-drawer-title>Title</z-drawer-title>
 *     <z-drawer-description>Description</z-drawer-description>
 *   </z-drawer-header>
 *   <z-drawer-footer>
 *     <button type="button" z-button z-drawer-close>Cancel</button>
 *   </z-drawer-footer>
 * </z-drawer>
 * ```
 */
@Component({
  selector: 'z-drawer',
  imports: [ZardDrawerPanelComponent],
  template: `
    <ng-template #panel>
      <z-drawer-panel
        [zPlacement]="zPlacement()"
        [zSnapPoints]="zSnapPoints()"
        [zSnapPoint]="zSnapPoint()"
        (zSnapPointChange)="zSnapPoint.set($event)"
        [zDismissible]="zDismissible()"
        [zHandle]="zHandle()"
        [zModal]="zModal()"
        [zState]="state()"
        [zDuration]="duration"
        [zLabelledBy]="titleId()"
        [zDescribedBy]="descriptionId()"
        [class]="class()"
        (closeRequested)="requestClose()"
      >
        <ng-content />
      </z-drawer-panel>
    </ng-template>
  `,
  // forwardRef: the decorator is evaluated before the class binding exists, so a bare
  // reference to ZardDrawerComponent here throws "Cannot access before initialization"
  // whenever the module is evaluated outside the AOT compiler.
  providers: [{ provide: ZardDrawerHost, useExisting: forwardRef(() => ZardDrawerComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  exportAs: 'zDrawer',
})
export class ZardDrawerComponent extends ZardDrawerHost {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly panel = viewChild.required<TemplateRef<void>>('panel');

  /** Open state, two-way bound. */
  readonly zVisible = model(false);
  /** Edge of the screen the drawer slides from. */
  readonly zPlacement = input<ZardDrawerPlacement>('bottom');
  /** Snap sizes: `0–1` is a viewport fraction, above that pixels, strings keep their unit. */
  readonly zSnapPoints = input<readonly ZardDrawerSnapPoint[] | undefined>(undefined);
  /** Active snap point, two-way bound. Defaults to the first one. */
  readonly zSnapPoint = model<ZardDrawerSnapPoint | undefined>(undefined);
  /** Whether swiping, the mask and Escape can close the drawer. */
  readonly zDismissible = input(true, { transform: booleanAttribute });
  /** Renders the swipe handle. */
  readonly zHandle = input(false, { transform: booleanAttribute });
  /** Renders the mask and blocks the page behind. Set false for a non-modal drawer. */
  readonly zModal = input(true, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  /** Emitted once the drawer has finished its exit animation and is gone. */
  readonly zAfterClose = output<void>();
  /** Emitted once the drawer is attached to the DOM. */
  readonly zAfterOpen = output<void>();

  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly state = signal<'open' | 'closed'>('open');
  protected readonly duration = DRAWER_DURATION;

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
    if (!this.zDismissible()) {
      return;
    }
    this.zVisible.set(false);
  }

  private open(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Re-opening mid-exit: keep the same overlay and reverse the animation.
    if (this.overlayRef) {
      this.clearDisposeTimer();
      this.state.set('open');
      return;
    }

    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.state.set('open');

    const modal = this.zModal();
    // A drawer opening on top of another one gets a see-through mask: the drawer
    // underneath dims itself instead, so masks never stack up into a black screen.
    const nested = hasOpenDrawer();

    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: modal,
        backdropClass: nested ? ['bg-transparent'] : DRAWER_BACKDROP_CLASSES,
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: modal ? this.overlay.scrollStrategies.block() : this.overlay.scrollStrategies.noop(),
        disposeOnNavigation: true,
      }),
    );
    this.overlayRef = overlayRef;

    overlayRef.attach(new TemplatePortal(this.panel(), this.viewContainerRef));

    overlayRef.backdropClick().subscribe(() => this.requestClose());
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
    this.disposeTimer = setTimeout(() => this.dispose(), this.duration);
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
  selector: 'z-drawer-header, [z-drawer-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerHeader',
})
export class ZardDrawerHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(drawerHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-drawer-title, [z-drawer-title]',
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
    'data-slot': 'drawer-title',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerTitle',
})
export class ZardDrawerTitleComponent {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly id = nextDrawerId('title');
  protected readonly classes = computed(() => mergeClasses(drawerTitleVariants(), this.class()));

  constructor() {
    // Registered after the first render: the panel reads this id through an input binding,
    // and writing to it mid-render would trip change-detection checks in dev mode.
    afterNextRender(() => this.drawer?.titleId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.drawer?.titleId() === this.id) {
        this.drawer.titleId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-drawer-description, [z-drawer-description]',
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
    'data-slot': 'drawer-description',
    '[attr.id]': 'id',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerDescription',
})
export class ZardDrawerDescriptionComponent {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly id = nextDrawerId('description');
  protected readonly classes = computed(() => mergeClasses(drawerDescriptionVariants(), this.class()));

  constructor() {
    afterNextRender(() => this.drawer?.descriptionId.set(this.id));

    inject(DestroyRef).onDestroy(() => {
      if (this.drawer?.descriptionId() === this.id) {
        this.drawer.descriptionId.set(null);
      }
    });
  }
}

@Component({
  selector: 'z-drawer-footer, [z-drawer-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'drawer-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zDrawerFooter',
})
export class ZardDrawerFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(drawerFooterVariants(), this.class()));
}

/** Closes the drawer it is projected into — declarative or service-opened alike. */
@Directive({
  selector: '[z-drawer-close]',
  host: {
    'data-slot': 'drawer-close',
    '(click)': 'onClick()',
  },
  exportAs: 'zDrawerClose',
})
export class ZardDrawerCloseDirective {
  private readonly drawer = inject(ZardDrawerHost, { optional: true });

  protected onClick(): void {
    this.drawer?.requestClose();
  }
}
