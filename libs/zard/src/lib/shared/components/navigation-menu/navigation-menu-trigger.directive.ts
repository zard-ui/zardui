import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  computed,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  navigationMenuTriggerIconVariants,
  navigationMenuTriggerVariants,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuManagerService } from './navigation-menu-manager.service';
import { NAVIGATION_MENU_POSITIONS_MAP, type ZardNavigationMenuPlacement } from './navigation-menu-positions';
import { ZardNavigationMenuService } from './navigation-menu.service';

export type ZardNavigationMenuTriggerMode = 'click' | 'hover';

/**
 * Opens the content bound to `[zNavigationMenuTriggerFor]`. It works in two modes:
 *
 * - **viewport** — inside a `<z-navigation-menu>` with `zViewport` on, the content is handed to the
 *   shared viewport, which morphs between triggers instead of opening one overlay per item;
 * - **overlay** — standalone, or with `[zViewport]="false"`, the CDK opens a popup anchored to the
 *   trigger and positioned by `zPlacement`.
 *
 * `CdkMenuTrigger` stays applied in both modes but is left inert in the viewport one: its `open()`
 * is a no-op while `menuTemplateRef` is null.
 */
@Directive({
  selector: '[z-navigation-menu-trigger]',
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    role: 'button',
    'data-slot': 'navigation-menu-trigger',
    '[class]': 'classes()',
    '[attr.tabindex]': "'0'",
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[style.cursor]': "'pointer'",
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
  hostDirectives: [CdkMenuTrigger],
  exportAs: 'zNavigationMenuTrigger',
})
export class ZardNavigationMenuTriggerDirective implements OnInit, OnDestroy {
  private static readonly TRIGGER_SELECTOR = '[z-navigation-menu-trigger]';

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menuManager = inject(ZardNavigationMenuManagerService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  /** Absent when the trigger is used outside a `<z-navigation-menu>`, which forces overlay mode. */
  private readonly service = inject(ZardNavigationMenuService, { optional: true });

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupFunctions: Array<() => void> = [];
  private index = -1;
  /** Mirrors the CDK overlay state, whose own `isOpen()` is a plain method and so not reactive. */
  private readonly overlayOpen = signal(false);

  readonly zNavigationMenuTriggerFor = input.required<TemplateRef<void>>();
  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zTrigger = input<ZardNavigationMenuTriggerMode>();
  readonly zHoverDelay = input<number>(100);
  readonly zPlacement = input<ZardNavigationMenuPlacement>('bottomLeft');
  readonly zShowChevron = input<boolean | undefined, BooleanInput | undefined>(undefined, {
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly class = input<ClassValue>('');

  /** True only inside a root whose `zViewport` is on — the only case the CDK trigger stays inert. */
  private readonly isViewportMode = computed(() => this.service?.viewport() ?? false);

  /**
   * Styling and the built-in chevron only kick in inside a root. Standalone the trigger stays
   * visually neutral, so the existing dropdown-style consumers keep rendering exactly as before.
   */
  protected readonly classes = computed(() =>
    this.service ? mergeClasses(navigationMenuTriggerVariants(), this.class()) : mergeClasses(this.class()),
  );

  protected readonly isOpen = computed(() =>
    this.isViewportMode() ? (this.service?.isActive(this.index) ?? false) : this.overlayOpen(),
  );

  private readonly menuPositions = computed(() => this.getPositionsByPlacement(this.zPlacement()));

  constructor() {
    effect(() => {
      const positions = this.menuPositions();
      untracked(() => {
        this.cdkTrigger.menuPosition = positions;
      });
    });

    // The switch that makes the dual mode work: with no template the CDK trigger cannot open.
    effect(() => {
      const template = this.zNavigationMenuTriggerFor();
      const viewportMode = this.isViewportMode();
      untracked(() => {
        this.cdkTrigger.menuTemplateRef = viewportMode ? null : template;
      });
    });

    // Keep the shared viewport pointed at this trigger's template while it owns it.
    effect(() => {
      const template = this.zNavigationMenuTriggerFor();
      if (!this.isViewportMode() || !this.service?.isActive(this.index)) return;

      untracked(() => this.openInViewport(template));
    });
  }

  ngOnInit(): void {
    this.index = this.service?.registerTrigger() ?? -1;

    this.trackOverlayState();

    if (this.shouldRenderChevron()) {
      this.renderChevron();
    }

    if (this.resolvedTrigger() === 'hover' && !this.isMobileDevice()) {
      this.initializeHoverBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cancelScheduledClose();
    this.menuManager.unregisterHoverMenu(this);
    this.service?.close(this.index);
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.length = 0;
  }

  close(): void {
    this.cancelScheduledClose();

    if (this.isViewportMode()) {
      this.service?.close(this.index);
      return;
    }

    this.cdkTrigger.close();
  }

  open(): void {
    if (this.zDisabled()) return;

    if (this.isViewportMode()) {
      this.openInViewport(this.zNavigationMenuTriggerFor());
      return;
    }

    this.cdkTrigger.open();
  }

  /** Hover is the navigation-menu default; standalone triggers keep opening on click. */
  private resolvedTrigger(): ZardNavigationMenuTriggerMode {
    return this.zTrigger() ?? (this.service ? 'hover' : 'click');
  }

  private shouldRenderChevron(): boolean {
    return this.zShowChevron() ?? !!this.service;
  }

  private openInViewport(template: TemplateRef<void>): void {
    this.service?.open({ index: this.index, template, element: this.elementRef.nativeElement });
  }

  protected onClick(event: Event): void {
    if (this.zDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.isViewportMode()) return;

    // The CDK trigger is inert here, so the viewport toggle is ours to drive.
    event.preventDefault();
    this.toggle();
  }

  private toggle(): void {
    if (this.service?.isActive(this.index)) {
      this.close();
      return;
    }

    this.open();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isViewportMode() || this.zDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.open();
        this.focusFirstLink();
        break;
      case 'Escape':
        if (!this.service?.isActive(this.index)) return;
        event.preventDefault();
        this.close();
        this.elementRef.nativeElement.focus({ preventScroll: true });
        break;
    }
  }

  private focusFirstLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Waits for the viewport to render the freshly activated template.
    setTimeout(() => {
      const link = this.document.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-viewport"] [z-navigation-menu-link]',
      );
      link?.focus({ preventScroll: true });
    });
  }

  private getPositionsByPlacement(placement: ZardNavigationMenuPlacement): ConnectedPosition[] {
    return NAVIGATION_MENU_POSITIONS_MAP[placement] || NAVIGATION_MENU_POSITIONS_MAP['bottomLeft'];
  }

  /**
   * The trigger is a directive — it has no template of its own — so the chevron is instantiated
   * imperatively and moved into the host element.
   */
  private renderChevron(): void {
    // The injector is explicit so NgIcon resolves the icon against this directive's `provideIcons`.
    const iconRef = this.viewContainerRef.createComponent(NgIcon, { injector: this.injector });
    iconRef.setInput('name', 'lucideChevronDown');

    // `class` is a host attribute on NgIcon, not an input, so it is set on the element itself.
    const icon = iconRef.location.nativeElement as HTMLElement;
    icon.className = navigationMenuTriggerIconVariants();
    icon.setAttribute('aria-hidden', 'true');
    this.elementRef.nativeElement.appendChild(icon);

    this.cleanupFunctions.push(() => iconRef.destroy());
  }

  private initializeHoverBehavior(): void {
    this.setupTriggerListeners();

    // Registered whatever the mode: the root pushes `zViewport` into the service through an effect,
    // which has not run by the time this init does, so the mode cannot be trusted here yet. It is
    // harmless in viewport mode — the CDK trigger stays inert there and never emits `opened`.
    this.setupMenuOpenListener();
  }

  private setupTriggerListeners(): void {
    const element = this.elementRef.nativeElement;

    this.addEventListenerWithCleanup(element, 'mouseenter', () => {
      if (this.zDisabled()) {
        return;
      }

      if (this.isViewportMode()) {
        this.service?.open({
          index: this.index,
          template: this.zNavigationMenuTriggerFor(),
          element,
        });
        return;
      }

      // Deliberately not focusing the trigger: the pointer must not move the focus, or the
      // `focus:bg-muted` and the focus ring would stay behind once the pointer moves away.
      this.cancelScheduledClose();
      this.menuManager.registerHoverMenu(this);
      this.cdkTrigger.open();
    });

    this.addEventListenerWithCleanup(element, 'mouseleave', event => this.scheduleCloseIfNeeded(event as MouseEvent));
  }

  /** Feeds `data-state` and the chevron rotation while the CDK owns the popup. */
  private trackOverlayState(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => this.overlayOpen.set(true));
    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.overlayOpen.set(false);
      this.returnFocusFromMenu();
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe(),
    );
  }

  /**
   * Brings the focus back from a popup that is closing. The CDK hands it to whichever trigger owns
   * the shared menu stack, which is the wrong one once a bar has more than one. Skipped when the
   * focus is elsewhere — closing on hover-out must not pull it in.
   */
  private returnFocusFromMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const menu = this.menuElement;
    const focused = this.document.activeElement;

    if (!menu || !focused || !menu.contains(focused)) return;

    // Deferred: the CDK moves the focus itself while tearing the overlay down.
    setTimeout(() => this.elementRef.nativeElement.focus({ preventScroll: true }));
  }

  private setupMenuOpenListener(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => {
      // After the render, not on a timer: the CDK only registers the child menu once change
      // detection has run, and until then there is no popup to attach the listeners to.
      afterNextRender({ read: () => this.setupMenuContentListeners() }, { injector: this.injector });
    });

    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.menuManager.unregisterHoverMenu(this);
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe(),
    );
  }

  /**
   * The popup this trigger owns, while it is open. Asking the CDK trigger for it — instead of
   * querying the document — keeps the lookup from matching another bar's popup, including the
   * shared viewport, which also renders inside an overlay pane.
   */
  private get menuElement(): HTMLElement | null {
    return this.cdkTrigger.getMenu()?.nativeElement ?? null;
  }

  private setupMenuContentListeners(): void {
    const menuContent = this.menuElement;
    if (!menuContent) {
      return;
    }

    this.addEventListenerWithCleanup(menuContent, 'mouseenter', () => this.cancelScheduledClose());
    this.addEventListenerWithCleanup(menuContent, 'mouseleave', event =>
      this.scheduleCloseIfNeeded(event as MouseEvent),
    );
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  private scheduleCloseIfNeeded(event: MouseEvent): void {
    if (this.isViewportMode()) {
      // The viewport owns the grace period — moving onto it cancels the close.
      this.service?.scheduleClose(this.index);
      return;
    }

    if (this.shouldKeepMenuOpen(event.relatedTarget as Element)) {
      return;
    }

    this.scheduleMenuClose();
  }

  private shouldKeepMenuOpen(relatedTarget: Element | null): boolean {
    if (!relatedTarget) {
      return false;
    }

    const isMovingToTrigger = this.elementRef.nativeElement.contains(relatedTarget);
    const isMovingToMenu = this.menuElement?.contains(relatedTarget) ?? false;
    const isMovingToOtherTrigger =
      relatedTarget.matches(ZardNavigationMenuTriggerDirective.TRIGGER_SELECTOR) &&
      !this.elementRef.nativeElement.contains(relatedTarget);

    if (isMovingToOtherTrigger) {
      return false;
    }

    return isMovingToTrigger || isMovingToMenu;
  }

  private scheduleMenuClose(): void {
    this.closeTimeout = setTimeout(() => {
      this.cdkTrigger.close();
    }, this.zHoverDelay());
  }

  private addEventListenerWithCleanup(
    element: Element,
    eventType: string,
    handler: (event: MouseEvent | Event) => void,
    options?: AddEventListenerOptions,
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      element.addEventListener(eventType, handler, options);
      this.cleanupFunctions.push(() => element.removeEventListener(eventType, handler, options));
    }
  }

  private isMobileDevice(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Default to desktop behavior on server
    }

    const window = this.document.defaultView;
    if (!window) {
      return false;
    }

    const { navigator } = window;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check for mobile user agent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);

    // Check viewport width for small screens
    const isSmallScreen = window.innerWidth <= 768;

    return hasTouch && (isMobileUA || isSmallScreen);
  }
}
