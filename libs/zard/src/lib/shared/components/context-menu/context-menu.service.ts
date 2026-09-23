import { type ElementRef, inject, Injectable, type TemplateRef, type ViewContainerRef } from '@angular/core';

import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownService, type ZardMenuOrigin } from '@/shared/components/dropdown/dropdown.service';

export interface ZardContextMenuOptions {
  /** Where the focus returns to once the menu closes. Defaults to whatever had it. */
  focusOrigin?: ElementRef;
  /**
   * Required only when `menu` is a bare `TemplateRef` — a `z-dropdown-menu-content` carries its
   * own, so the common call is just `create(event, menu)`.
   */
  viewContainerRef?: ViewContainerRef;
}

/**
 * Opens a menu at a pointer event or a coordinate, the way `NzContextMenuService.create()` does.
 * It exists for what the `[z-context-menu]` directive cannot express: one shared menu for many
 * rows, whose content depends on which row was clicked, or an anchor that is a point on a canvas
 * rather than an element.
 *
 * ```ts
 * private readonly contextMenu = inject(ZardContextMenuService);
 *
 * openMenu(event: MouseEvent, row: Row) {
 *   this.selected.set(row);
 *   this.contextMenu.create(event, this.rowMenu());
 * }
 * ```
 *
 * The overlay is the dropdown's, so a menu opened here closes on the same terms as any other:
 * selecting an item, clicking outside, scrolling or `Escape`.
 */
@Injectable({ providedIn: 'root' })
export class ZardContextMenuService {
  private readonly dropdownService = inject(ZardDropdownService);

  /** True while a menu opened through this service — or any dropdown — is on screen. */
  readonly isOpen = this.dropdownService.isOpen;

  create(
    origin: MouseEvent | ZardMenuOrigin,
    menu: ZardDropdownMenuContentComponent | TemplateRef<void>,
    options?: ZardContextMenuOptions,
  ): void {
    const template = menu instanceof ZardDropdownMenuContentComponent ? menu.contentTemplate() : menu;
    const viewContainerRef =
      menu instanceof ZardDropdownMenuContentComponent ? menu.viewContainerRef : options?.viewContainerRef;

    if (!viewContainerRef) {
      throw new Error(
        'ZardContextMenuService.create() needs a viewContainerRef when the menu is a TemplateRef. ' +
          'Pass one in the options, or hand it a z-dropdown-menu-content instead.',
      );
    }

    this.dropdownService.openAt(toOrigin(origin), template, viewContainerRef, options?.focusOrigin);
  }

  close(): void {
    this.dropdownService.close();
  }
}

/**
 * A `MouseEvent` already carries the viewport coordinates the overlay anchors to. Duck-typed
 * rather than `instanceof`: `MouseEvent` is not defined on the server.
 */
function toOrigin(origin: MouseEvent | ZardMenuOrigin): ZardMenuOrigin {
  return 'clientX' in origin ? { x: origin.clientX, y: origin.clientY } : origin;
}
