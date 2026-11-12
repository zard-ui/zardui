import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  type OnDestroy,
  untracked,
  ViewContainerRef,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownService } from '@/shared/components/dropdown/dropdown.service';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardMenubarComponent, type ZardMenubarItem } from './menubar.component';
import { menubarTriggerVariants } from './menubar.variants';

/**
 * shadcn's `MenubarContent` defaults to `sideOffset 8` / `alignOffset -4` where `DropdownMenuContent`
 * uses 4 / 0: the bar's own padding sits between the trigger and the menu. The menu content owns
 * `zSideOffset`, so the bar adds its extra on top of whatever the content asks for.
 */
const BAR_SIDE_OFFSET = 4;
const BAR_ALIGN_OFFSET = -4;

/**
 * One menu of the bar. Put it on a button inside `z-menubar` and point `zMenubarMenu` at a
 * `z-dropdown-menu-content`: the rows are the dropdown primitives, the bar only adds the shared
 * keyboard and hover behaviour on top of them.
 *
 * ```html
 * <button z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
 * <z-dropdown-menu-content #fileMenu="zDropdownMenuContent">...</z-dropdown-menu-content>
 * ```
 */
@Directive({
  selector: '[z-menubar-trigger]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'menubar-trigger',
    role: 'menuitem',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-disabled]': 'zDisabled() || null',
    '[attr.disabled]': 'zDisabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'zDisabled() || null',
    '[attr.tabindex]': 'isTabbable() ? 0 : -1',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(focus)': 'menubar.setActive(element)',
    '(keydown)': 'onKeydown($event)',
    '(keyup)': 'onKeyup($event)',
  },
  exportAs: 'zMenubarTrigger',
})
export class ZardMenubarTriggerDirective implements ZardMenubarItem, OnDestroy {
  protected readonly menubar = inject(ZardMenubarComponent);
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly zMenubarMenu = input.required<ZardDropdownMenuContentComponent>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zVisible = model(false);
  readonly class = input<ClassValue>('');

  readonly element = this.elementRef.nativeElement;
  readonly disabled = this.zDisabled;

  /** Open *and* owned by this trigger — the service holds a single menu for the whole page. */
  protected readonly isOpen = computed(
    () => this.dropdownService.isOpen() && this.dropdownService.getTriggerElement() === this.elementRef,
  );

  protected readonly isTabbable = computed(() => this.menubar.tabbableElement() === this.element);
  protected readonly classes = computed(() => mergeClasses(menubarTriggerVariants(), this.class()));

  constructor() {
    this.menubar.register(this);

    // The service is the source of truth for what is open; `zVisible` mirrors it...
    effect(() => {
      const open = this.isOpen();
      untracked(() => {
        if (this.zVisible() !== open) {
          this.zVisible.set(open);
        }
      });
    });

    // ...and a write from outside — `zVisible` bound by the parent — opens or closes the menu.
    effect(() => {
      const visible = this.zVisible() && !this.zDisabled();
      untracked(() => {
        if (visible && !this.isOpen()) {
          this.open();
        } else if (!visible && this.isOpen()) {
          this.dropdownService.close();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.menubar.unregister(this);
    if (this.isOpen()) {
      this.dropdownService.close();
    }
  }

  open(initialFocus?: 'first' | 'last'): void {
    if (this.zDisabled()) {
      return;
    }

    const menu = this.zMenubarMenu();
    this.menubar.setActive(this.element);
    this.dropdownService.open(
      this.elementRef,
      menu.contentTemplate(),
      this.viewContainerRef,
      {
        side: menu.zSide(),
        align: menu.zAlign(),
        sideOffset: menu.zSideOffset() + BAR_SIDE_OFFSET,
        alignOffset: BAR_ALIGN_OFFSET,
      },
      { initialFocus },
    );
  }

  protected onClick(): void {
    if (this.zDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.dropdownService.close();
    } else {
      this.open();
    }
  }

  /** While a menu of the bar is open, pointing at another trigger switches to it — no delay. */
  protected onMouseEnter(): void {
    if (!this.zDisabled() && !this.isOpen() && this.menubar.hasOpenMenu()) {
      this.open();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.zDisabled()) {
      return;
    }

    const next = this.menubar.nextKey();
    const previous = next === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';

    switch (event.key) {
      case next:
        event.preventDefault();
        this.menubar.focusAdjacent(this, 1, this.isOpen());
        return;
      case previous:
        event.preventDefault();
        this.menubar.focusAdjacent(this, -1, this.isOpen());
        return;
      case 'Home':
        event.preventDefault();
        this.menubar.focusEdge('first', this.isOpen());
        return;
      case 'End':
        event.preventDefault();
        this.menubar.focusEdge('last', this.isOpen());
        return;
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        // Also keeps the browser from turning `Enter`/`Space` into a click that would toggle it back.
        event.preventDefault();
        this.openFromKeyboard('first');
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.openFromKeyboard('last');
        return;
      case 'Tab':
        // Leaves the bar, and the menu goes with it: the one the pointer switched to is not focused.
        if (this.isOpen()) {
          this.dropdownService.close();
        }
        return;
    }
  }

  /** `Space` activates a button on key up, so cancelling the key down alone is not enough everywhere. */
  protected onKeyup(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  private openFromKeyboard(initialFocus: 'first' | 'last'): void {
    if (this.isOpen()) {
      this.dropdownService.focusEdgeItem(initialFocus);
    } else {
      this.open(initialFocus);
    }
  }
}
