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
import { noopFn } from '@/shared/utils/merge-classes';

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
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private unlisten: () => void = noopFn;

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
    this.createOverlay(triggerElement, placement);

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
    }, 0);

    // Close on outside click
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !triggerElement.nativeElement.contains(event.target)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  getTriggerElement(): ElementRef | undefined {
    return this.triggerElement;
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten();
    this.destroyOverlay();
    this.isOpen.set(false);
    this.triggerElement = undefined;
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

  private destroyOverlay() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten = this.renderer.listen(
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
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>(
        'z-dropdown-menu-item, [z-dropdown-menu-item], z-dropdown-menu-checkbox-item, [z-dropdown-menu-checkbox-item], z-dropdown-menu-radio-item, [z-dropdown-menu-radio-item]',
      ),
    ).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.focusedIndex();
    let nextIndex: number;

    if (currentIndex === -1) {
      // No item focused yet — start from first or last depending on direction
      nextIndex = direction > 0 ? 0 : items.length - 1;
    } else {
      nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        nextIndex = items.length - 1;
      } else if (nextIndex >= items.length) {
        nextIndex = 0;
      }
    }

    this.focusItemAtIndex(items, nextIndex);
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
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.dataset['highlighted'] = '';
      } else {
        delete item.dataset['highlighted'];
      }
    }
  }
}
