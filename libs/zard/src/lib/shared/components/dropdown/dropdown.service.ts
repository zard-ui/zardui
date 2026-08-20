import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  type Renderer2,
  RendererFactory2,
  signal,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';

import { filter, type Subscription } from 'rxjs';

import {
  buildDropdownPositions,
  type ZardDropdownAlign,
  type ZardDropdownSide,
} from '@/shared/components/dropdown/dropdown-positions';

import { findMenuItemByChar, getMenuItems, highlightMenuItem, isTypeaheadKey, nextMenuIndex } from './menu-keyboard';

/** A viewport coordinate a menu can be anchored to, instead of an element. */
export interface ZardMenuOrigin {
  x: number;
  y: number;
}

/** Placement of the menu relative to its trigger, mirroring Radix's `side`/`align`/`sideOffset`. */
export interface ZardDropdownPlacement {
  side?: ZardDropdownSide;
  align?: ZardDropdownAlign;
  sideOffset?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly rendererFactory = inject(RendererFactory2);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  /**
   * The element whose own clicks must not close the menu. It is the trigger for a dropdown — the
   * click that toggles it would otherwise register as an outside click and close it right back —
   * and nothing for a context menu, where a plain click anywhere, the trigger included, closes.
   */
  private outsideClickExempt?: ElementRef;
  /**
   * A right click ends in an `auxclick`, which the CDK reports as an outside pointer event — so the
   * very gesture that opens a context menu would close it again on mouse up. Only the first one is
   * dropped: every later right click is a real dismissal.
   */
  private skipFirstAuxClick = false;
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private keydownSubscription?: Subscription;
  private unlisten: Array<() => void> = [];

  readonly isOpen = signal(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggle(
    triggerElement: ElementRef,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    placement?: ZardDropdownPlacement,
  ) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef, placement);
    }
  }

  private open(
    triggerElement: ElementRef,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    placement?: ZardDropdownPlacement,
  ) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.outsideClickExempt = triggerElement;
    this.skipFirstAuxClick = false;
    this.createOverlay(triggerElement, placement);
    this.attach(template, viewContainerRef);
  }

  /**
   * Opens the menu at a viewport coordinate instead of below an element — what a context menu
   * needs, since it belongs to the pointer and not to an anchor. `focusOrigin` is where `Escape`
   * and selecting an item hand the focus back to.
   */
  openAt(
    origin: ZardMenuOrigin,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    focusOrigin?: ElementRef,
  ) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = focusOrigin;
    this.outsideClickExempt = undefined;
    this.skipFirstAuxClick = true;
    this.createPointOverlay(origin);
    this.attach(template, viewContainerRef);
  }

  private attach(template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
    }, 0);

    /**
     * `Escape` is also taken at the overlay level, not only on the surface: the CDK routes it to
     * the top-most overlay whatever holds the focus, so the menu still closes after a click that
     * left the focus on the body. The dispatcher only ever feeds the top overlay, so an open
     * submenu keeps its own `Escape` to itself.
     */
    this.keydownSubscription = this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key !== 'Escape' || !this.isOpen()) {
        return;
      }

      event.preventDefault();
      this.closeAndFocusTrigger();
    });

    // Close on outside click
    const exempt = this.outsideClickExempt;
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => this.closesOnOutsideEvent(event, exempt)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  private closesOnOutsideEvent(event: MouseEvent, exempt: ElementRef | undefined): boolean {
    if (this.skipFirstAuxClick && event.type === 'auxclick') {
      this.skipFirstAuxClick = false;
      return false;
    }

    return !exempt?.nativeElement.contains(event.target);
  }

  getTriggerElement(): ElementRef | undefined {
    return this.triggerElement;
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten.forEach(unlisten => unlisten());
    this.unlisten = [];
    this.destroyOverlay();
    this.isOpen.set(false);
    this.triggerElement = undefined;
    this.outsideClickExempt = undefined;
  }

  closeAndReturnTrigger(): ElementRef | undefined {
    const trigger = this.triggerElement;
    this.close();
    return trigger;
  }

  closeAndFocusTrigger() {
    const trigger = this.closeAndReturnTrigger();
    trigger?.nativeElement.focus();
  }

  private createOverlay(triggerElement: ElementRef, placement?: ZardDropdownPlacement) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions(
        buildDropdownPositions(placement?.side ?? 'bottom', placement?.align ?? 'start', placement?.sideOffset ?? 4),
      )
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: 200,
      maxHeight: 400,
    });

    this.publishTriggerWidth(triggerElement);
  }

  /**
   * Radix exposes the trigger's width to the menu as `--radix-dropdown-menu-trigger-width`, which
   * shadcn uses to make a menu exactly as wide as the button that opened it. This is the Zard
   * equivalent, published on the overlay pane so `w-(--z-dropdown-menu-trigger-width)` works inside.
   */
  private publishTriggerWidth(triggerElement: ElementRef) {
    if (!this.overlayRef || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = (triggerElement.nativeElement as HTMLElement).getBoundingClientRect().width;
    this.overlayRef.hostElement.style.setProperty('--z-dropdown-menu-trigger-width', `${width}px`);
  }

  /**
   * Anchored to a zero-sized rect at the pointer. The four positions are the four quadrants it can
   * grow into, so the menu flips instead of spilling out of the viewport, and `close()` as the
   * scroll strategy matches every native context menu: scrolling dismisses it.
   */
  private createPointOverlay(origin: ZardMenuOrigin) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  private destroyOverlay() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
    this.keydownSubscription?.unsubscribe();
    this.keydownSubscription = undefined;
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten.push(
      this.renderer.listen(
        dropdownElement,
        'keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent',
        (event: KeyboardEvent) => {
          const items = this.getDropdownItems();

          switch (event.key) {
            case 'ArrowDown':
              this.navigateItems(1, items);
              break;
            case 'ArrowUp':
              this.navigateItems(-1, items);
              break;
            case 'Enter':
            case ' ':
              this.selectFocusedItem(items);
              break;
            case 'Escape': {
              const triggerToFocus = this.closeAndReturnTrigger();
              triggerToFocus?.nativeElement.focus();
              break;
            }
            case 'Home':
              this.focusItemAtIndex(items, 0);
              break;
            case 'End':
              this.focusItemAtIndex(items, items.length - 1);
              break;
          }
        },
      ),
    );

    // A right click inside the surface must not strand the keyboard: the press blurs the focused
    // row, so the surface takes the focus back instead of leaving it on the body.
    this.unlisten.push(
      this.renderer.listen(dropdownElement, 'contextmenu', (event: MouseEvent) => {
        event.preventDefault();
        dropdownElement.focus();
      }),
    );

    // Typeahead: a printable key jumps to the next row whose label starts with it.
    this.unlisten.push(
      this.renderer.listen(dropdownElement, 'keydown', (event: KeyboardEvent) => {
        if (!isTypeaheadKey(event)) {
          return;
        }

        const items = this.getDropdownItems();
        const match = findMenuItemByChar(items, event.key, this.focusedIndex());
        if (match === -1) {
          return;
        }

        event.preventDefault();
        this.focusItemAtIndex(items, match);
      }),
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }

    return getMenuItems(this.overlayRef.overlayElement);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    this.focusItemAtIndex(items, nextMenuIndex(items, this.focusedIndex(), direction));
  }

  private focusItemAtIndex(items: HTMLElement[], index: number) {
    if (index >= 0 && index < items.length) {
      this.focusedIndex.set(index);
      this.updateItemFocus(items, index);
    }
  }

  private focusFirstItem() {
    const items = this.getDropdownItems();
    if (items.length > 0) {
      this.focusItemAtIndex(items, 0);
    }
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    highlightMenuItem(items, focusedIndex);
  }
}
