import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { type ElementRef, inject, Injectable, PLATFORM_ID, signal, type TemplateRef, type ViewContainerRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;

  readonly isOpen = signal(false);

  toggle(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef);
    }
  }

  open(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.createOverlay(triggerElement);

    if (!this.overlayRef) return;

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
      this.focusFirstItem();
    }, 0);

    // Close on outside click
    this.outsideClickSubscription = this.overlayRef.outsidePointerEvents().subscribe(() => {
      this.close();
    });
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.destroyOverlay();
  }

  private createOverlay(triggerElement: ElementRef) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: 200,
      maxHeight: 400,
    });
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      if (this.outsideClickSubscription) {
        this.outsideClickSubscription.unsubscribe();
      }
    }
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) return;

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) return;

    dropdownElement.addEventListener('keydown', (event: KeyboardEvent) => {
      const items = this.getDropdownItems();

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.navigateItems(1, items);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.navigateItems(-1, items);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.selectFocusedItem(items);
          break;
        case 'Escape':
          event.preventDefault();
          this.close();
          this.triggerElement?.nativeElement.focus();
          break;
        case 'Home':
          event.preventDefault();
          this.focusItemAtIndex(items, 0);
          break;
        case 'End':
          event.preventDefault();
          this.focusItemAtIndex(items, items.length - 1);
          break;
      }
    });

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) return [];
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll<HTMLElement>('z-dropdown-menu-item, [z-dropdown-menu-item]')).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) return;

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
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
