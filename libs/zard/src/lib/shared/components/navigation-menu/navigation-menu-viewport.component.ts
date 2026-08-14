import { CdkConnectedOverlay, type ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  navigationMenuViewportVariants,
  navigationMenuViewportWrapperVariants,
  type ZardNavigationMenuAlign,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

const AUTO_SIZE = { width: 'auto', height: 'auto' } as const;

/** Breathing room kept between the popup and the window edges when the bar sits near one. */
const WINDOW_MARGIN = 8;

/** Anchored to the bar itself; the offset to the active trigger is applied inside the pane. */
const OVERLAY_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
];

/**
 * The single popup shared by every trigger of a `<z-navigation-menu>`. It renders the active
 * trigger's template, morphs its own width/height to match and slides horizontally to line up with
 * whichever trigger owns it — the three transitions together produce the morph between items.
 *
 * It is rendered through a CDK overlay rather than inline: a navigation bar is routinely placed
 * inside containers that clip (`overflow: hidden`), and an inline popup would be cut off by them.
 */
@Component({
  selector: 'z-navigation-menu-viewport',
  imports: [CdkConnectedOverlay, NgTemplateOutlet],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin()"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
      [cdkConnectedOverlayFlexibleDimensions]="false"
      [cdkConnectedOverlayPush]="false"
      (overlayKeydown)="onOverlayKeydown($event)"
    >
      <div
        [class]="wrapperClasses()"
        [style.translate]="offset()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
      >
        <div
          [class]="viewportClasses()"
          data-slot="navigation-menu-viewport"
          data-state="open"
          [style.--zard-navigation-menu-viewport-width]="size().width"
          [style.--zard-navigation-menu-viewport-height]="size().height"
        >
          <div #content class="w-max">
            <ng-container [ngTemplateOutlet]="template()!" />
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // The popup lives in the overlay, so the host itself must not take part in the bar's layout.
  host: { class: 'contents' },
  exportAs: 'zNavigationMenuViewport',
})
export class ZardNavigationMenuViewportComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly service = inject(ZardNavigationMenuService);

  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly measured = signal<{ width: string; height: string }>({ ...AUTO_SIZE });
  private readonly offsetX = signal(0);
  /** Opening from closed would otherwise animate out of the previous item's size and position. */
  private readonly instant = signal(false);

  private resizeObserver: ResizeObserver | null = null;
  private observedContent: HTMLElement | null = null;
  private wasOpen = false;

  readonly align = signal<ZardNavigationMenuAlign>('start');

  protected readonly positions = OVERLAY_POSITIONS;
  protected readonly scrollStrategy = this.overlay.scrollStrategies.reposition();

  protected readonly template = this.service.activeTemplate;
  protected readonly size = this.measured.asReadonly();
  protected readonly isOpen = computed(() => this.template() !== null);
  protected readonly offset = computed(() => `${this.offsetX()}px 0`);
  /** Falls back to the host only before the root has registered itself, when nothing is open yet. */
  protected readonly origin = computed(() => this.service.rootElement() ?? this.elementRef.nativeElement);

  protected readonly wrapperClasses = computed(() =>
    mergeClasses(navigationMenuViewportWrapperVariants(), this.instant() && 'transition-none'),
  );

  protected readonly viewportClasses = computed(() =>
    mergeClasses(navigationMenuViewportVariants(), this.instant() && 'transition-none'),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.disconnectObserver());
    this.watchWindowResize();

    effect(() => {
      const template = this.template();

      if (!template) {
        this.wasOpen = false;
        return;
      }

      const fresh = !this.wasOpen;
      this.wasOpen = true;
      untracked(() => this.scheduleMeasure(fresh));
    });

    // Changing which edge to line up with has to re-run the offset maths.
    effect(() => {
      this.align();

      untracked(() => {
        if (this.isOpen()) this.scheduleMeasure(false);
      });
    });
  }

  protected onMouseEnter(): void {
    this.service.cancelScheduledClose();
  }

  protected onMouseLeave(): void {
    this.service.scheduleClose();
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;

    // Captured before closing, since closing is what clears the active trigger.
    const trigger = this.service.active()?.element;

    event.preventDefault();
    this.service.close();
    trigger?.focus({ preventScroll: true });
  }

  private scheduleMeasure(fresh: boolean): void {
    this.instant.set(fresh || this.measured().width === AUTO_SIZE.width);

    afterNextRender(
      {
        read: () => {
          this.measure();

          if (this.instant()) {
            requestAnimationFrame(() => this.instant.set(false));
          }
        },
      },
      { injector: this.injector },
    );
  }

  private measure(): void {
    const element = this.content()?.nativeElement;
    if (!element) return;

    const size = { width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px` };
    const current = this.measured();

    if (current.width !== size.width || current.height !== size.height) {
      this.measured.set(size);
    }

    this.updateOffset(element.offsetWidth);
    this.observe(element);
  }

  /** Slides the popup so the requested edge lines up with the active trigger, not with the bar. */
  private updateOffset(width: number): void {
    const active = this.service.active();
    const root = this.service.rootElement();
    const view = this.document.defaultView;

    if (!active || !root || !view || !isPlatformBrowser(this.platformId)) return;

    const trigger = active.element.getBoundingClientRect();
    const bar = root.getBoundingClientRect();

    let left: number;
    switch (this.align()) {
      case 'center':
        left = trigger.left + trigger.width / 2 - width / 2;
        break;
      case 'end':
        left = trigger.right - width;
        break;
      default:
        left = trigger.left;
    }

    const rightmost = view.innerWidth - WINDOW_MARGIN - width;
    const clamped = Math.max(WINDOW_MARGIN, Math.min(left, rightmost));

    // The pane already sits at the bar's left edge, so the offset is relative to it.
    this.offsetX.set(Math.round(clamped - bar.left));
  }

  /** Keeps the morph honest when the rendered content resizes after being mounted. */
  private observe(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || typeof ResizeObserver === 'undefined') return;
    if (this.observedContent === element) return;

    this.resizeObserver ??= new ResizeObserver(() => this.measure());

    if (this.observedContent) {
      this.resizeObserver.unobserve(this.observedContent);
    }

    this.resizeObserver.observe(element);
    this.observedContent = element;
  }

  private watchWindowResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const view = this.document.defaultView;
    if (!view) return;

    const onResize = () => this.measure();
    view.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => view.removeEventListener('resize', onResize));
  }

  private disconnectObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.observedContent = null;
  }
}
