---
title: Menubar
description: A visually persistent bar of command menus, as found in desktop applications.
---

# Menubar

A visually persistent bar of command menus, as found in desktop applications.

## Installation

### CLI

```bash
npx zard-cli@latest add menubar
```

### Manual

```angular-ts
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
```

```angular-ts
import { cva } from 'class-variance-authority';

export const menubarVariants = cva('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs');

export const menubarTriggerVariants = cva(
  'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
);
```

```angular-ts
export * from './menubar.component';
export * from './menubar.imports';
export * from './menubar.variants';
export * from './menubar-trigger.directive';
```

```angular-ts
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

    // The service is the source of truth for what is open; `zVisible` mirrors it. Only a change of the
    // service state is written back, so a `zVisible` bound to `true` from the start is not overwritten
    // by the initial "closed" before the effect below gets to open the menu...
    let reportedOpen = false;
    effect(() => {
      const open = this.isOpen();
      untracked(() => {
        if (open !== reportedOpen) {
          reportedOpen = open;
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
```

```angular-ts
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from '@/shared/components/dropdown/dropdown-primitives.component';
import {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from '@/shared/components/dropdown/dropdown-submenu.component';
import { ZardMenubarTriggerDirective } from '@/shared/components/menubar/menubar-trigger.directive';
import { ZardMenubarComponent } from '@/shared/components/menubar/menubar.component';

/** The bar, its trigger, and every menu primitive the menus are built from. */
export const ZardMenubarImports = [
  ZardMenubarComponent,
  ZardMenubarTriggerDirective,
  ZardDropdownMenuContentComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSubTriggerComponent,
  ZardDropdownMenuSubContentComponent,
] as const;
```

## Usage

```angular-ts
import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';
```

```angular-html
<z-menubar>
  <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
  <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
</z-menubar>

<z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
  <z-dropdown-menu-item>
    New Tab
    <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
  </z-dropdown-menu-item>
  <z-dropdown-menu-item>New Window</z-dropdown-menu-item>
  <z-dropdown-menu-separator />
  <z-dropdown-menu-item>Print...</z-dropdown-menu-item>
</z-dropdown-menu-content>

<z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
  <z-dropdown-menu-item>Undo</z-dropdown-menu-item>
  <z-dropdown-menu-item>Redo</z-dropdown-menu-item>
</z-dropdown-menu-content>
```

## Examples

### Shortcuts

Add `z-dropdown-menu-shortcut` to show keyboard hints.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-shortcuts',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        New Tab
        <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        New Window
        <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        Print...
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        Undo
        <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        Redo
        <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        Cut
        <z-dropdown-menu-shortcut>⌘X</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        Copy
        <z-dropdown-menu-shortcut>⌘C</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        Paste
        <z-dropdown-menu-shortcut>⌘V</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarShortcutsComponent {}
```

### Checkbox Radio

Use `z-dropdown-menu-checkbox-item` for toggles and `z-dropdown-menu-radio-group` for exclusive choices.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-checkbox-radio',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
    </z-menubar>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        Always Show Bookmarks Bar
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Always Show Full URLs</z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-label>Profiles</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarCheckboxRadioComponent {
  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly profile = signal('benoit');
}
```

### Submenu

Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-submenu',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>New Tab</z-dropdown-menu-item>
      <z-dropdown-menu-item>New Window</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">Share</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>Email link</z-dropdown-menu-item>
        <z-dropdown-menu-item>Messages</z-dropdown-menu-item>
        <z-dropdown-menu-item>Notes</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Print...</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>Undo</z-dropdown-menu-item>
      <z-dropdown-menu-item>Redo</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="findMenu">Find</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #findMenu="zDropdownMenuSubContent" class="w-48">
        <z-dropdown-menu-item>Search the web</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>Find...</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Next</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Previous</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
      <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
      <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarSubmenuComponent {}
```

### Disabled

A trigger with `zDisabled` stays in the bar but is skipped by the arrow keys and the hover switch.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-disabled',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger zDisabled [zMenubarMenu]="editMenu">Edit</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>New Tab</z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled>New Incognito Window</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Print...</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>Undo</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
      <z-dropdown-menu-item>Toggle Fullscreen</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarDisabledComponent {}
```

### App Bar

Every piece together: shortcuts, submenus, checkbox items and a radio group in a full application bar.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-app-bar',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        New Tab
        <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        New Window
        <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled>New Incognito Window</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">Share</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>Email link</z-dropdown-menu-item>
        <z-dropdown-menu-item>Messages</z-dropdown-menu-item>
        <z-dropdown-menu-item>Notes</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        Print...
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        Undo
        <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        Redo
        <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="findMenu">Find</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #findMenu="zDropdownMenuSubContent" class="w-48">
        <z-dropdown-menu-item>Search the web</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>Find...</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Next</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Previous</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
      <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
      <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        Always Show Bookmarks Bar
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Always Show Full URLs</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>
        Reload
        <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item zInset zDisabled>
        Force Reload
        <z-dropdown-menu-shortcut>⇧⌘R</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Toggle Fullscreen</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Hide Sidebar</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Edit...</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Add Profile...</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarAppBarComponent {
  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly profile = signal('benoit');
}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface MenubarRtlValues {
  file: string;
  edit: string;
  view: string;
  profiles: string;
  newTab: string;
  newWindow: string;
  share: string;
  emailLink: string;
  messages: string;
  print: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  showBookmarks: string;
  showFullUrls: string;
  andy: string;
  benoit: string;
  luis: string;
}

const translations: ZardRtlTranslations<MenubarRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      file: 'File',
      edit: 'Edit',
      view: 'View',
      profiles: 'Profiles',
      newTab: 'New Tab',
      newWindow: 'New Window',
      share: 'Share',
      emailLink: 'Email link',
      messages: 'Messages',
      print: 'Print...',
      undo: 'Undo',
      redo: 'Redo',
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      showBookmarks: 'Always Show Bookmarks Bar',
      showFullUrls: 'Always Show Full URLs',
      andy: 'Andy',
      benoit: 'Benoit',
      luis: 'Luis',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      file: 'ملف',
      edit: 'تحرير',
      view: 'عرض',
      profiles: 'الملفات الشخصية',
      newTab: 'علامة تبويب جديدة',
      newWindow: 'نافذة جديدة',
      share: 'مشاركة',
      emailLink: 'رابط البريد الإلكتروني',
      messages: 'الرسائل',
      print: 'طباعة...',
      undo: 'تراجع',
      redo: 'إعادة',
      cut: 'قص',
      copy: 'نسخ',
      paste: 'لصق',
      showBookmarks: 'إظهار شريط الإشارات دائمًا',
      showFullUrls: 'إظهار العناوين الكاملة دائمًا',
      andy: 'أندي',
      benoit: 'بنوا',
      luis: 'لويس',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      file: 'קובץ',
      edit: 'עריכה',
      view: 'תצוגה',
      profiles: 'פרופילים',
      newTab: 'לשונית חדשה',
      newWindow: 'חלון חדש',
      share: 'שיתוף',
      emailLink: 'קישור באימייל',
      messages: 'הודעות',
      print: 'הדפסה...',
      undo: 'בטל',
      redo: 'בצע שוב',
      cut: 'גזור',
      copy: 'העתק',
      paste: 'הדבק',
      showBookmarks: 'הצג תמיד את סרגל הסימניות',
      showFullUrls: 'הצג תמיד כתובות מלאות',
      andy: 'אנדי',
      benoit: 'בנואה',
      luis: 'לואיס',
    },
  },
};

@Component({
  selector: 'z-demo-menubar-rtl',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">{{ i18n.t().file }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">{{ i18n.t().edit }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">{{ i18n.t().view }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">{{ i18n.t().profiles }}</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        {{ i18n.t().newTab }}
        <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        {{ i18n.t().newWindow }}
        <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">{{ i18n.t().share }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>{{ i18n.t().emailLink }}</z-dropdown-menu-item>
        <z-dropdown-menu-item>{{ i18n.t().messages }}</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        {{ i18n.t().print }}
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        {{ i18n.t().undo }}
        <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        {{ i18n.t().redo }}
        <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>{{ i18n.t().cut }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().copy }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().paste }}</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        {{ i18n.t().showBookmarks }}
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">
        {{ i18n.t().showFullUrls }}
      </z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">{{ i18n.t().andy }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">{{ i18n.t().benoit }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">{{ i18n.t().luis }}</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly profile = signal('benoit');
}
```

## API Reference

### z-menubar

The bar. Keeps a single tab stop over its triggers, moves between them with `←`/`→` and switches the open menu on hover.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### [z-menubar-trigger]

One menu of the bar: put it on a button inside `z-menubar`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zMenubarMenu]` | Menu content opened by this trigger (`#ref="zDropdownMenuContent"`). Opens 4px further than its `zSideOffset`, as in shadcn | `ZardDropdownMenuContentComponent` | `-` |
| `[zDisabled]` | Disables the trigger; arrow navigation skips it | `boolean` | `false` |
| `[zVisible]` | Opens or closes this menu | `boolean` | `false` |
| `[(zVisible)]` | Open state of this menu, two-way bound | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-content

Menu surface; the rows are the same `z-dropdown-menu-*` primitives the dropdown uses.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zSide]` | Trigger edge the menu opens from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `[zAlign]` | Alignment along that edge | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zSideOffset]` | Gap from the trigger in px | `number` | `4` |

### z-dropdown-menu-item

Clickable row that closes the menu on select.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Visual style | `'default' \| 'destructive'` | `'default'` |
| `[zInset]` | Adds start padding for alignment | `boolean` | `false` |
| `[zDisabled]` | Disables the item | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-checkbox-item

Row with a checked state.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zChecked)]` | Checked state | `boolean` | `false` |
| `[zDisabled]` | Disables the item | `boolean` | `false` |
| `[zType]` | Visual style | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-group

Wrapper for radio items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zValue)]` | Selected value | `string \| undefined` | `undefined` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-item

Row with radio semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zValue]` | Item value | `string` | `-` |
| `[zDisabled]` | Disables the item | `boolean` | `false` |
| `[zType]` | Visual style | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-sub-trigger

Row that opens a nested menu.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSubMenu]` | Submenu content (`#ref="zDropdownMenuSubContent"`) | `ZardDropdownMenuSubContentComponent \| TemplateRef<unknown>` | `-` |
| `[zInset]` | Adds start padding for alignment | `boolean` | `false` |
| `[zDisabled]` | Disables the sub-trigger | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-sub-content

Submenu surface; opens beside its trigger and flips when needed.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-label

Group label.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[inset]` | Adds start padding for alignment | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-group

Groups related rows.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-separator

Divider between sections.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-shortcut

Keyboard hint inside a row.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/menubar)
