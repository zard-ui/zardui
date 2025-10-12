import { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ZardMenuManagerService } from '@zard/components/menu/menu-manager.service';


export interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Directive that enables context menu (right-click menu) functionality.
 *
 * @example
 * ```html
 * <div [zContextMenuTriggerFor]="menu">Right click here</div>
 *
 * <ng-template #menu>
 *   <div z-menu-content class="w-48">
 *     <button z-menu-item>Option 1</button>
 *     <button z-menu-item>Option 2</button>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[zContextMenuTriggerFor]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: zContextMenuTriggerFor'],
    },
  ],
  host: {
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[attr.tabindex]': "zDisabled() ? '-1' : '0'",
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown.shift.f10)': 'onKeyboardContextMenu($event)',
  },
})
export class ZardContextMenuTriggerDirective implements OnInit, OnDestroy {
  private static readonly MENU_OVERLAY_SELECTOR =
    '.cdk-overlay-container .cdk-overlay-pane:last-child';
  private static readonly PADDING = 8; // Padding from viewport edges

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly menuManager = inject(ZardMenuManagerService);

  private readonly cleanupFunctions: Array<() => void> = [];
  private currentPosition: ContextMenuPosition | null = null;
  private resizeObserver?: ResizeObserver;

  readonly zContextMenuTriggerFor = input.required<TemplateRef<any>>();
  readonly zDisabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });
  readonly zPreventDefault = input<boolean, BooleanInput>(true, {
    transform: booleanAttribute,
  });

  ngOnInit(): void {
    this.setupGlobalListeners();
    this.setupMenuOpenListener();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.menuManager.unregisterHoverMenu(this as any);
    this.resizeObserver?.disconnect();
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions.length = 0;
  }

  /**
   * Handles right-click context menu events
   */
  onContextMenu(event: MouseEvent): void {
    if (this.zDisabled()) return;

    if (this.zPreventDefault()) {
      event.preventDefault();
    }
    event.stopPropagation();

    this.currentPosition = { x: event.clientX, y: event.clientY };
    this.openContextMenu();
  }

  /**
   * Handles keyboard-triggered context menu (Shift+F10)
   */
  onKeyboardContextMenu(event: KeyboardEvent): void {
    if (this.zDisabled()) return;

    event.preventDefault();
    event.stopPropagation();
    this.openContextMenuAtElement();
  }

  /**
   * Closes the context menu
   */
  close(): void {
    this.cdkTrigger.close();
    this.currentPosition = null;
  }

  /**
   * Opens the context menu at the current stored position
   */
  private openContextMenu(): void {
    if (this.cdkTrigger.isOpen()) {
      this.cdkTrigger.close();
    }

    // Small delay to ensure clean state transition
    setTimeout(() => {
      this.cdkTrigger.open();
    }, 10);
  }

  /**
   * Opens the context menu centered on the trigger element
   */
  private openContextMenuAtElement(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.currentPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    this.openContextMenu();
  }

  /**
   * Sets up global event listeners for menu interactions
   */
  private setupGlobalListeners(): void {
    // Close context menu on outside click
    this.addEventListenerWithCleanup(document, 'click', (event: Event) => {
      if (this.cdkTrigger.isOpen() && !this.isEventInsideMenu(event)) {
        this.close();
      }
    });

    // Close context menu on outside right-click
    this.addEventListenerWithCleanup(
      document,
      'contextmenu',
      (event: MouseEvent) => {
        if (this.cdkTrigger.isOpen() && !this.isEventInsideMenu(event)) {
          this.close();
        }
      }
    );

    // Close context menu on scroll
    this.addEventListenerWithCleanup(
      document,
      'scroll',
      () => {
        if (this.cdkTrigger.isOpen()) {
          this.close();
        }
      },
      { passive: true, capture: true }
    );

    // Close context menu on window resize
    this.addEventListenerWithCleanup(window, 'resize', () => {
      if (this.cdkTrigger.isOpen()) {
        this.close();
      }
    });

    // Close context menu on escape key
    this.addEventListenerWithCleanup(document, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.cdkTrigger.isOpen()) {
        event.preventDefault();
        event.stopPropagation();
        this.close();
        this.elementRef.nativeElement.focus();
      }
    });
  }

  /**
   * Sets up listeners for menu open/close events
   */
  private setupMenuOpenListener(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => {
      requestAnimationFrame(() => {
        this.positionMenu();
        this.setupMenuKeyboardNavigation();
        this.focusFirstMenuItem();
      });
    });

    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.menuManager.unregisterHoverMenu(this as any);
      this.currentPosition = null;
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe()
    );
  }

  /**
   * Sets up a resize observer to reposition menu if content changes
   */
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.cdkTrigger.isOpen()) {
        requestAnimationFrame(() => this.positionMenu());
      }
    });
  }

  /**
   * Positions the menu overlay at the stored cursor position,
   * ensuring it stays within viewport bounds
   */
  private positionMenu(): void {
    if (!this.currentPosition) return;

    const overlay = document.querySelector(
      ZardContextMenuTriggerDirective.MENU_OVERLAY_SELECTOR
    ) as HTMLElement;
    if (!overlay) return;

    const menu = overlay.querySelector('[z-menu-content]') as HTMLElement;
    if (!menu) return;

    // Observe menu size changes
    if (this.resizeObserver) {
      this.resizeObserver.observe(menu);
    }

    const { x, y } = this.currentPosition;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = ZardContextMenuTriggerDirective.PADDING;

    // Calculate optimal position with padding
    let finalX = x;
    let finalY = y;

    // Adjust horizontal position if menu would overflow
    if (x + menuRect.width + padding > viewportWidth) {
      finalX = Math.max(padding, viewportWidth - menuRect.width - padding);
      // If still doesn't fit, try left side of cursor
      if (finalX > x) {
        finalX = Math.max(padding, x - menuRect.width);
      }
    }

    // Adjust vertical position if menu would overflow
    if (y + menuRect.height + padding > viewportHeight) {
      finalY = Math.max(padding, viewportHeight - menuRect.height - padding);
      // If still doesn't fit, try above cursor
      if (finalY > y) {
        finalY = Math.max(padding, y - menuRect.height);
      }
    }

    // Ensure minimum padding from edges
    finalX = Math.max(padding, Math.min(finalX, viewportWidth - menuRect.width - padding));
    finalY = Math.max(padding, Math.min(finalY, viewportHeight - menuRect.height - padding));

    // Apply position
    overlay.style.left = `${finalX}px`;
    overlay.style.top = `${finalY}px`;
    overlay.style.position = 'fixed';
  }

  /**
   * Sets up keyboard navigation for the menu
   */
  private setupMenuKeyboardNavigation(): void {
    const overlay = document.querySelector(
      ZardContextMenuTriggerDirective.MENU_OVERLAY_SELECTOR
    );
    if (!overlay) return;

    this.addEventListenerWithCleanup(
      overlay,
      'keydown',
      (event: KeyboardEvent) => {
        if (!this.cdkTrigger.isOpen()) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            this.focusNextMenuItem();
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.focusPreviousMenuItem();
            break;
          case 'Home':
            event.preventDefault();
            this.focusFirstMenuItem();
            break;
          case 'End':
            event.preventDefault();
            this.focusLastMenuItem();
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            this.activateCurrentMenuItem();
            break;
          case 'ArrowRight':
            event.preventDefault();
            this.expandSubmenuIfAvailable();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            this.collapseSubmenuOrClose();
            break;
          case 'Tab':
            // Trap focus within menu
            event.preventDefault();
            if (event.shiftKey) {
              this.focusPreviousMenuItem();
            } else {
              this.focusNextMenuItem();
            }
            break;
        }
      }
    );
  }

  /**
   * Focuses the first non-disabled menu item
   */
  private focusFirstMenuItem(): void {
    const menuItems = this.getMenuItems();
    const firstFocusable = menuItems.find(
      (item) => !this.isMenuItemDisabled(item)
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Focuses the last non-disabled menu item
   */
  private focusLastMenuItem(): void {
    const menuItems = this.getMenuItems();
    const lastFocusable = [...menuItems]
      .reverse()
      .find((item) => !this.isMenuItemDisabled(item));
    if (lastFocusable) {
      lastFocusable.focus();
    }
  }

  /**
   * Focuses the next non-disabled menu item (wraps to first)
   */
  private focusNextMenuItem(): void {
    const menuItems = this.getMenuItems();
    const currentIndex = menuItems.findIndex(
      (item) => item === document.activeElement
    );

    if (currentIndex === -1) {
      this.focusFirstMenuItem();
      return;
    }

    // Search forward for next focusable item
    for (let i = currentIndex + 1; i < menuItems.length; i++) {
      if (!this.isMenuItemDisabled(menuItems[i])) {
        menuItems[i].focus();
        return;
      }
    }

    // Wrap to first item
    this.focusFirstMenuItem();
  }

  /**
   * Focuses the previous non-disabled menu item (wraps to last)
   */
  private focusPreviousMenuItem(): void {
    const menuItems = this.getMenuItems();
    const currentIndex = menuItems.findIndex(
      (item) => item === document.activeElement
    );

    if (currentIndex === -1) {
      this.focusLastMenuItem();
      return;
    }

    // Search backward for previous focusable item
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.isMenuItemDisabled(menuItems[i])) {
        menuItems[i].focus();
        return;
      }
    }

    // Wrap to last item
    this.focusLastMenuItem();
  }

  /**
   * Activates (clicks) the currently focused menu item
   */
  private activateCurrentMenuItem(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && this.isMenuItem(activeElement)) {
      if (!this.isMenuItemDisabled(activeElement)) {
        activeElement.click();
      }
    }
  }

  /**
   * Expands submenu if the focused item has one
   */
  private expandSubmenuIfAvailable(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && this.hasSubmenu(activeElement)) {
      if (!this.isMenuItemDisabled(activeElement)) {
        activeElement.click();
        // Focus first item in submenu after a small delay
        setTimeout(() => this.focusFirstMenuItem(), 50);
      }
    }
  }

  /**
   * Collapses submenu or closes the context menu
   */
  private collapseSubmenuOrClose(): void {
    const activeMenu = document.activeElement?.closest('[z-menu-content]');
    if (!activeMenu) {
      this.close();
      this.elementRef.nativeElement.focus();
      return;
    }

    // Check if we're in a submenu
    const parentOverlay = activeMenu.parentElement?.closest('.cdk-overlay-pane');
    const rootOverlay = document.querySelector(
      ZardContextMenuTriggerDirective.MENU_OVERLAY_SELECTOR
    );

    if (parentOverlay && parentOverlay !== rootOverlay) {
      // We're in a submenu, find and focus the parent trigger
      const parentTrigger = parentOverlay.querySelector(
        '[aria-expanded="true"]'
      ) as HTMLElement;
      if (parentTrigger) {
        parentTrigger.focus();
        // Close the submenu
        const closeButton = activeMenu.querySelector('[aria-label="Close"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
        return;
      }
    }

    // Otherwise close the context menu
    this.close();
    this.elementRef.nativeElement.focus();
  }

  /**
   * Gets all menu items in the current menu overlay
   */
  private getMenuItems(): HTMLElement[] {
    const overlay = document.querySelector(
      ZardContextMenuTriggerDirective.MENU_OVERLAY_SELECTOR
    );
    if (!overlay) return [];

    // Get the currently visible menu content
    const visibleMenu = Array.from(
      overlay.querySelectorAll('[z-menu-content]')
    ).find((menu) => {
      const style = window.getComputedStyle(menu as HTMLElement);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (!visibleMenu) return [];

    return Array.from(
      visibleMenu.querySelectorAll(
        '[z-menu-item]:not([role="separator"]), [role="menuitem"]:not([role="separator"])'
      )
    ) as HTMLElement[];
  }

  /**
   * Checks if an element is a menu item
   */
  private isMenuItem(element: HTMLElement): boolean {
    return (
      element.hasAttribute('z-menu-item') ||
      element.getAttribute('role') === 'menuitem'
    );
  }

  /**
   * Checks if a menu item is disabled
   */
  private isMenuItemDisabled(element: HTMLElement): boolean {
    return (
      element.hasAttribute('disabled') ||
      element.getAttribute('aria-disabled') === 'true' ||
      element.hasAttribute('data-disabled') ||
      element.hasAttribute('zDisabled')
    );
  }

  /**
   * Checks if a menu item has a submenu
   */
  private hasSubmenu(element: HTMLElement): boolean {
    return (
      element.getAttribute('aria-haspopup') === 'menu' ||
      element.hasAttribute('z-submenu-trigger')
    );
  }

  /**
   * Checks if an event occurred inside the menu overlay
   */
  private isEventInsideMenu(event: Event): boolean {
    const target = event.target as Element;
    if (!target) return false;

    const overlay = document.querySelector(
      ZardContextMenuTriggerDirective.MENU_OVERLAY_SELECTOR
    );
    return overlay ? overlay.contains(target) : false;
  }

  /**
   * Adds an event listener and registers cleanup function
   */
  private addEventListenerWithCleanup(
    element: Element | Document | Window,
    eventType: string,
    handler: (event: any) => void,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(eventType, handler, options);
    this.cleanupFunctions.push(() =>
      element.removeEventListener(eventType, handler, options)
    );
  }
}
