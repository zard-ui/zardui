import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  INJECTOR,
  input,
  type OnDestroy,
  PLATFORM_ID,
  runInInjectionContext,
  untracked,
} from '@angular/core';

import { MENU_POSITIONS_MAP, type ZardMenuPlacement } from './menu-positions';

@Directive({
  selector: '[z-context-menu]',
  standalone: true,
  host: {
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[attr.tabindex]': "zDisabled() ? '-1' : '0'",
    '[style.cursor]': "'context-menu'",
  },
  hostDirectives: [
    {
      directive: CdkContextMenuTrigger,
      inputs: ['cdkContextMenuTriggerFor: zContextMenuTriggerFor'],
    },
  ],
})
export class ZardContextMenuDirective implements OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(INJECTOR);
  protected readonly cdkTrigger = inject(CdkContextMenuTrigger, { host: true });

  readonly zContextMenuTriggerFor = input.required();
  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zPlacement = input<ZardMenuPlacement>('bottomRight');

  private readonly menuPositions = computed(() => this.getPositionsByPlacement(this.zPlacement()));
  private lastOpenMethod: 'mouse' | 'keyboard' | 'programmatic' = 'programmatic';

  constructor() {
    effect(() => {
      const positions = this.menuPositions();
      untracked(() => {
        this.cdkTrigger.menuPosition = positions;
      });
    });

    this.initializeContextMenuBehavior();
  }

  private getPositionsByPlacement(placement: ZardMenuPlacement): ConnectedPosition[] {
    return MENU_POSITIONS_MAP[placement] || MENU_POSITIONS_MAP['topLeft'];
  }

  private initializeContextMenuBehavior(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element = this.elementRef.nativeElement;

    // Prevent default context menu on right-click
    element.addEventListener('contextmenu', this.handleContextMenu);

    // Handle keyboard interaction for accessibility
    element.addEventListener('keydown', this.handleKeyDown);
  }

  readonly handleContextMenu = (event: MouseEvent): void => {
    if (this.zDisabled()) {
      event.preventDefault();
      return;
    }
    this.lastOpenMethod = 'mouse';
    // Let CDK handle the context menu, but ensure it's triggered
    // The CDKContextMenuTrigger will automatically handle this
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    // Open context menu with Shift+F10 or Menu key (ContextMenu key)
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      if (this.zDisabled()) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      this.lastOpenMethod = 'keyboard';
      this.open();
    }
  };

  ngOnDestroy(): void {
    // Cleanup event listeners
    if (isPlatformBrowser(this.platformId)) {
      const element = this.elementRef.nativeElement;
      element.removeEventListener('contextmenu', this.handleContextMenu);
      element.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * Programmatically open the context menu
   */
  open(coordinates?: { x: number; y: number }): void {
    if (!this.zDisabled()) {
      // Use provided coordinates or default to center of the element
      const coords = coordinates || this.getDefaultCoordinates();
      this.cdkTrigger.open(coords);

      // Focus the menu overlay when opened via keyboard
      if (this.lastOpenMethod === 'keyboard') {
        this.focusMenuOverlay();
      }
    }
  }

  /**
   * Focus the menu overlay for keyboard accessibility
   */
  private focusMenuOverlay(): void {
    // Use afterNextRender to ensure that overlay is fully rendered
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        const menuContent = document.querySelector('.cdk-overlay-pane [z-menu-content]') as HTMLElement;
        if (menuContent) {
          menuContent.focus();
        }
      });
    });
  }

  /**
   * Get default coordinates for the context menu (center of the element)
   */
  private getDefaultCoordinates(): { x: number; y: number } {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  /**
   * Programmatically close the context menu
   */
  close(): void {
    // CDKContextMenuTrigger doesn't have a close method, so we'll emit a close event
    // or let the overlay handle closing automatically
    // For now, we'll remove the close method since it's not needed for context menus
  }
}
