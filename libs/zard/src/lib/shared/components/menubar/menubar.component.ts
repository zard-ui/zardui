import { Directionality } from '@angular/cdk/bidi';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  type Signal,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardDropdownService } from '@/shared/components/dropdown/dropdown.service';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { menubarVariants } from './menubar.variants';

/** What the bar needs to know about one of its triggers. Kept as an interface so the bar never imports them. */
export interface ZardMenubarItem {
  readonly element: HTMLElement;
  readonly disabled: Signal<boolean>;
  open(initialFocus?: 'first' | 'last'): void;
}

const MENU_SELECTOR = '[role="menu"]';

/**
 * The persistent bar of command menus. It owns what the menus share: a single tab stop (roving
 * `tabindex` over its triggers), `←/→` between them — which also switches the open menu — and
 * `Tab`, which leaves the bar and closes whatever is open.
 *
 * ```html
 * <z-menubar>
 *   <button z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
 * </z-menubar>
 * ```
 */
@Component({
  selector: 'z-menubar, [z-menubar]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'menubar',
    role: 'menubar',
    'aria-orientation': 'horizontal',
  },
  exportAs: 'zMenubar',
})
export class ZardMenubarComponent {
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly directionality = inject(Directionality, { optional: true });
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly class = input<ClassValue>('');

  private readonly items = signal<ZardMenubarItem[]>([]);
  private readonly activeElement = signal<HTMLElement | null>(null);

  protected readonly classes = computed(() => mergeClasses(menubarVariants(), this.class()));

  /** The one trigger in the tab order: the last focused one, or the first enabled when none was. */
  readonly tabbableElement = computed(() => {
    const enabled = this.enabledItems();
    const active = this.activeElement();
    return enabled.find(item => item.element === active)?.element ?? enabled[0]?.element ?? null;
  });

  /** A menu opened from this bar is on screen. */
  readonly hasOpenMenu = computed(() => this.openItem() !== undefined);

  constructor() {
    // Capture phase: `Tab` must be seen before a submenu closes the surface on its own, and the
    // arrows before the menu rows handle them, so the bar can tell which ones are really its own.
    afterNextRender(() => {
      const onKeydown = (event: KeyboardEvent) => this.onDocumentKeydown(event);
      this.document.addEventListener('keydown', onKeydown, true);
      this.destroyRef.onDestroy(() => this.document.removeEventListener('keydown', onKeydown, true));
    });
  }

  register(item: ZardMenubarItem): void {
    this.items.update(items => [...items, item]);
  }

  unregister(item: ZardMenubarItem): void {
    this.items.update(items => items.filter(current => current !== item));
  }

  setActive(element: HTMLElement): void {
    this.activeElement.set(element);
  }

  isRtl(): boolean {
    return this.directionality?.value === 'rtl';
  }

  /** The key that moves to the next trigger: it follows the direction of the bar. */
  nextKey(): 'ArrowRight' | 'ArrowLeft' {
    return this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
  }

  /** Focuses the trigger `delta` steps away, wrapping and skipping disabled ones; opens its menu when asked to. */
  focusAdjacent(from: ZardMenubarItem, delta: 1 | -1, openMenu: boolean): void {
    const enabled = this.enabledItems();
    if (enabled.length === 0) {
      return;
    }

    const index = enabled.indexOf(from);
    const target =
      index === -1
        ? enabled[delta > 0 ? 0 : enabled.length - 1]
        : enabled[(index + delta + enabled.length) % enabled.length];
    this.moveTo(target, openMenu);
  }

  focusEdge(edge: 'first' | 'last', openMenu: boolean): void {
    const enabled = this.enabledItems();
    this.moveTo(edge === 'first' ? enabled[0] : enabled[enabled.length - 1], openMenu);
  }

  private moveTo(item: ZardMenubarItem | undefined, openMenu: boolean): void {
    if (!item) {
      return;
    }

    item.element.focus();
    this.setActive(item.element);
    if (openMenu) {
      item.open('first');
    }
  }

  private enabledItems(): ZardMenubarItem[] {
    return this.items()
      .filter(item => !item.disabled())
      .sort((a, b) => (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  }

  private openItem(): ZardMenubarItem | undefined {
    if (!this.dropdownService.isOpen()) {
      return undefined;
    }

    const trigger = this.dropdownService.getTriggerElement()?.nativeElement;
    return this.items().find(item => item.element === trigger);
  }

  /**
   * Keys pressed inside an open menu that belong to the bar. The menu surface lives in an overlay,
   * outside the bar's subtree, so they can only be taken at the document.
   */
  private onDocumentKeydown(event: KeyboardEvent): void {
    const open = this.openItem();
    const { target } = event;
    if (!open || !(target instanceof Element) || this.elementRef.nativeElement.contains(target)) {
      return;
    }

    // Only keys pressed inside the open menu (or a submenu of it) belong to the bar: a focused control
    // elsewhere — an input in a dialog — must neither close it on Tab nor have its arrows switch it.
    const menu = target.closest(MENU_SELECTOR);
    if (!menu) {
      return;
    }

    if (event.key === 'Tab') {
      // Leaves the bar: the focus goes back to the trigger first so the browser moves on from there.
      this.dropdownService.close();
      open.element.focus();
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    const isNext = event.key === this.nextKey();
    const inSubmenu = menu.getAttribute('data-slot') === 'dropdown-menu-sub-content';
    const onSubTrigger = target.closest('[data-slot="dropdown-menu-sub-trigger"]') !== null;
    // The row owns these: the next arrow opens a submenu, the previous one closes the one it is in.
    if ((isNext && onSubTrigger) || (inSubmenu && !isNext)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.focusAdjacent(open, isNext ? 1 : -1, true);
  }
}
