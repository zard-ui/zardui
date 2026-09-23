import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { type ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownService } from '@/shared/components/dropdown/dropdown.service';

import { ZardContextMenuService } from './context-menu.service';

/**
 * Opens the menu bound to `[zContextMenuTriggerFor]` at the pointer, replacing the browser's own
 * menu over this element. The keyboard route is the same one native context menus answer to — the
 * `ContextMenu` key and `Shift + F10` — and opens the menu at the centre of the element.
 *
 * ```html
 * <div z-context-menu [zContextMenuTriggerFor]="menu">Right click here</div>
 *
 * <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-52">
 *   <z-dropdown-menu-item>Back</z-dropdown-menu-item>
 * </z-dropdown-menu-content>
 * ```
 *
 * Set `[zDisabled]` to hand the native menu back to the browser.
 */
@Directive({
  selector: '[z-context-menu]',
  host: {
    'data-slot': 'context-menu-trigger',
    class: 'select-none',
    // The iOS long-press callout would race the menu for the same gesture.
    '[style.-webkit-touch-callout]': '"none"',
    /**
     * Focusable so the keyboard route works, but carrying no ARIA of its own: `aria-haspopup` and
     * `aria-expanded` are invalid on a generic element, and the menu announces itself — it is a
     * `role="menu"` that takes the focus when it opens. This is what shadcn renders too.
     */
    '[attr.tabindex]': 'zDisabled() ? null : "0"',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'zDisabled() || null',
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown)': 'onKeydown($event)',
  },
  exportAs: 'zContextMenu',
})
export class ZardContextMenuDirective {
  private readonly contextMenuService = inject(ZardContextMenuService);
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly zContextMenuTriggerFor = input.required<ZardDropdownMenuContentComponent | TemplateRef<void>>();
  readonly zDisabled = input(false, { transform: booleanAttribute });

  readonly zVisibleChange = output<boolean>();

  /** Open *and* owned by this trigger — several may share one page, only one may be open. */
  readonly isOpen = computed(
    () => this.dropdownService.isOpen() && this.dropdownService.getTriggerElement() === this.elementRef,
  );

  private lastEmitted = false;

  constructor() {
    effect(() => {
      const visible = this.isOpen();
      if (visible === this.lastEmitted) {
        return;
      }

      this.lastEmitted = visible;
      this.zVisibleChange.emit(visible);
    });
  }

  open(origin?: MouseEvent): void {
    if (this.zDisabled()) {
      return;
    }

    this.contextMenuService.create(origin ?? this.elementCenter(), this.zContextMenuTriggerFor(), {
      focusOrigin: this.elementRef,
      viewContainerRef: this.viewContainerRef,
    });
  }

  close(): void {
    if (this.isOpen()) {
      this.contextMenuService.close();
    }
  }

  protected onContextMenu(event: MouseEvent): void {
    if (this.zDisabled()) {
      return;
    }

    // Owning `contextmenu` is the whole point of the component, and stopping it here is what lets
    // a nested trigger win over the one wrapping it instead of both opening.
    event.preventDefault();
    event.stopPropagation();

    this.open(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.zDisabled()) {
      return;
    }

    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      this.open();
    }
  }

  /** Where a keyboard-opened menu is anchored, since there is no pointer to anchor it to. */
  private elementCenter(): { x: number; y: number } {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
}
