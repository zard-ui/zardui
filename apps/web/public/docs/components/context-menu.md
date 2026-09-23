---
title: Context Menu
description: Displays a menu of actions triggered by a right click.
---

# Context Menu

Displays a menu of actions triggered by a right click.

## About

The menu surface and every row are the dropdown primitives, so one vocabulary covers the dropdown and the context menu. The trigger is declarative for the common case; for the dynamic one — a single menu serving many rows — inject the service, mirroring ng-zorro's

[NzContextMenuService](https://ng.ant.design/components/dropdown/en)

## Installation

### CLI

```bash
npx zard-cli@latest add context-menu
```

### Manual

```angular-ts
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
```

```angular-ts
import { ZardContextMenuDirective } from '@/shared/components/context-menu/context-menu.directive';
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

/** The trigger plus every menu primitive the content is built from. */
export const ZardContextMenuImports = [
  ZardContextMenuDirective,
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

```angular-ts
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
```

```angular-ts
export * from './context-menu.directive';
export * from './context-menu.imports';
export * from './context-menu.service';
```

## Usage

```angular-ts
import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';
```

```angular-html
<div z-context-menu [zContextMenuTriggerFor]="menu">Right click here</div>

<z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
  <z-dropdown-menu-item>Back</z-dropdown-menu-item>
  <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
  <z-dropdown-menu-separator />
  <z-dropdown-menu-item zType="destructive">Delete</z-dropdown-menu-item>
</z-dropdown-menu-content>
```

## Composition

```text
div[z-context-menu]
└── z-dropdown-menu-content
    ├── z-dropdown-menu-group
    │   ├── z-dropdown-menu-label
    │   └── z-dropdown-menu-item
    │       └── z-dropdown-menu-shortcut
    ├── z-dropdown-menu-sub-trigger
    ├── z-dropdown-menu-sub-content
    │   └── z-dropdown-menu-item
    ├── z-dropdown-menu-separator
    ├── z-dropdown-menu-checkbox-item
    ├── z-dropdown-menu-separator
    └── z-dropdown-menu-radio-group
        ├── z-dropdown-menu-label
        └── z-dropdown-menu-radio-item
```

## Examples

### Basic

A few actions, one of them disabled. Right click the area to open the menu.

```angular-ts
import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-basic-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item (click)="log('Back')">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled>Forward</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">Reload</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuBasicDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Submenu

Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.

```angular-ts
import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-submenu-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item (click)="log('Copy')">
        Copy
        <z-dropdown-menu-shortcut>⌘C</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Cut')">
        Cut
        <z-dropdown-menu-shortcut>⌘X</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-sub-trigger [zSubMenu]="moreTools">More Tools</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #moreTools="zDropdownMenuSubContent" class="w-48">
        <z-dropdown-menu-item (click)="log('Save Page')">Save Page...</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Create Shortcut')">Create Shortcut...</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Name Window')">Name Window...</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item (click)="log('Developer Tools')">Developer Tools</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">Delete</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuSubmenuDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Shortcuts

Add `z-dropdown-menu-shortcut` to show keyboard hints.

```angular-ts
import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-shortcuts-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item (click)="log('Back')">
        Back
        <z-dropdown-menu-shortcut>⌘[</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled>
        Forward
        <z-dropdown-menu-shortcut>⌘]</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">
        Reload
        <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Save')">
        Save
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Save As')">
        Save As...
        <z-dropdown-menu-shortcut>⇧⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuShortcutsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Groups

Group related actions and separate them with dividers.

```angular-ts
import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-groups-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-group>
        <z-dropdown-menu-label>File</z-dropdown-menu-label>
        <z-dropdown-menu-item (click)="log('New File')">
          New File
          <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Open File')">
          Open File
          <z-dropdown-menu-shortcut>⌘O</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-label>Edit</z-dropdown-menu-label>
        <z-dropdown-menu-item (click)="log('Undo')">
          Undo
          <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="log('Redo')">
          Redo
          <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">
          Delete
          <z-dropdown-menu-shortcut>⌫</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuGroupsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Icons

Combine icons with labels for quick scanning.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardPaste, lucideCopy, lucideScissors, lucideTrash2 } from '@ng-icons/lucide';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-icons-demo',
  imports: [ZardContextMenuImports, NgIcon],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item (click)="log('Copy')">
        <ng-icon name="lucideCopy" class="text-muted-foreground" />
        Copy
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Cut')">
        <ng-icon name="lucideScissors" class="text-muted-foreground" />
        Cut
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Paste')">
        <ng-icon name="lucideClipboardPaste" class="text-muted-foreground" />
        Paste
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">
        <ng-icon name="lucideTrash2" />
        Delete
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucideClipboardPaste, lucideCopy, lucideScissors, lucideTrash2 })],
  host: { class: 'contents' },
})
export class ZardContextMenuIconsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Checkboxes

Use `z-dropdown-menu-checkbox-item` for toggles.

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-checkboxes-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-52">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarksBar">Show Bookmarks Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Show Full URLs</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showDeveloperTools">
        Show Developer Tools
      </z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuCheckboxesDemoComponent {
  readonly showBookmarksBar = signal(true);
  readonly showFullUrls = signal(false);
  readonly showDeveloperTools = signal(true);
}
```

### Radio

Use `z-dropdown-menu-radio-item` for exclusive choices.

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-radio-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-radio-group [(zValue)]="person">
        <z-dropdown-menu-label>People</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="pedro">Pedro Duarte</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="colm">Colm Tuite</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-radio-group [(zValue)]="theme">
        <z-dropdown-menu-label>Theme</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuRadioDemoComponent {
  readonly person = signal('pedro');
  readonly theme = signal('light');
}
```

### Destructive

Use `zType="destructive"` to style the row as destructive.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideShare, lucideTrash2 } from '@ng-icons/lucide';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-destructive-demo',
  imports: [ZardContextMenuImports, NgIcon],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item (click)="log('Edit')">
        <ng-icon name="lucidePencil" class="text-muted-foreground" />
        Edit
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Share')">
        <ng-icon name="lucideShare" class="text-muted-foreground" />
        Share
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">
        <ng-icon name="lucideTrash2" />
        Delete
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucidePencil, lucideShare, lucideTrash2 })],
  host: { class: 'contents' },
})
export class ZardContextMenuDestructiveDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Table Rows

One menu serving many rows: inject `ZardContextMenuService` and call `create($event, menu)` from the row that was clicked.

```angular-ts
import { Component, inject, signal, viewChild } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';
import { ZardContextMenuService } from '@/shared/components/context-menu/context-menu.service';
import { type ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface FileRow {
  id: number;
  name: string;
  size: string;
  pinned: boolean;
}

@Component({
  selector: 'z-context-menu-table-rows-demo',
  imports: [ZardContextMenuImports, ZardTableImports],
  template: `
    <div class="w-full max-w-md">
      <table z-table>
        <thead z-table-header>
          <tr z-table-row>
            <th z-table-head>Name</th>
            <th z-table-head class="text-right">Size</th>
          </tr>
        </thead>
        <tbody z-table-body>
          @for (row of rows(); track row.id) {
            <tr z-table-row class="cursor-context-menu" (contextmenu)="openMenu($event, row)">
              <td z-table-cell>
                {{ row.name }}
                @if (row.pinned) {
                  <span class="text-muted-foreground ml-2 text-xs">pinned</span>
                }
              </td>
              <td z-table-cell class="text-right">{{ row.size }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="text-muted-foreground mt-3 text-sm">Right click a row.</p>
    </div>

    <z-dropdown-menu-content #rowMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-label>{{ selected()?.name }}</z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="rename()">Rename</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="duplicate()">Duplicate</z-dropdown-menu-item>
      <z-dropdown-menu-checkbox-item [zChecked]="selected()?.pinned ?? false" (zCheckedChange)="togglePin()">
        Pin row
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="remove()">Delete</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuTableRowsDemoComponent {
  private readonly contextMenu = inject(ZardContextMenuService);
  private readonly rowMenu = viewChild.required<ZardDropdownMenuContentComponent>('rowMenu');

  readonly rows = signal<FileRow[]>([
    { id: 1, name: 'invoice-2024.pdf', size: '120 KB', pinned: false },
    { id: 2, name: 'roadmap.md', size: '8 KB', pinned: true },
    { id: 3, name: 'logo.svg', size: '2 KB', pinned: false },
  ]);

  readonly selected = signal<FileRow | undefined>(undefined);

  openMenu(event: MouseEvent, row: FileRow) {
    event.preventDefault();
    this.selected.set(row);
    this.contextMenu.create(event, this.rowMenu());
  }

  rename() {
    console.log('rename', this.selected()?.name);
  }

  duplicate() {
    console.log('duplicate', this.selected()?.name);
  }

  togglePin() {
    const target = this.selected();
    if (!target) {
      return;
    }

    this.rows.update(rows => rows.map(row => (row.id === target.id ? { ...row, pinned: !row.pinned } : row)));
    this.selected.update(row => (row ? { ...row, pinned: !row.pinned } : row));
  }

  remove() {
    const target = this.selected();
    if (!target) {
      return;
    }

    this.rows.update(rows => rows.filter(row => row.id !== target.id));
  }
}
```

### Disabled

With `zDisabled` the trigger stands down and the browser shows its own menu.

```angular-ts
import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-disabled-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      zDisabled
      [zContextMenuTriggerFor]="menu"
      class="text-muted-foreground flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click for the browser menu
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item>Back</z-dropdown-menu-item>
      <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuDisabledDemoComponent {}
```

## API Reference

### z-context-menu

Trigger directive. Opens the linked menu at the pointer, replacing the browser menu.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zContextMenuTriggerFor]` | Menu content opened at the pointer, exported as `zDropdownMenuContent`. | `ZardDropdownMenuContentComponent \| TemplateRef<void>` | `-` |
| `[zDisabled]` | Disables the trigger and restores the native browser menu. | `boolean` | `false` |
| `(zVisibleChange)` | Emits when the menu opens or closes. | `EventEmitter<boolean>` | `-` |

### ZardContextMenuService

Opens a menu at a pointer event or a coordinate, for one shared menu serving many rows. Injected with `inject(ZardContextMenuService)`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `create()` | Opens `menu` at the event or coordinate. Options take a `focusOrigin` and a `viewContainerRef`. | `(origin: MouseEvent \| { x: number; y: number }, menu: ZardDropdownMenuContentComponent \| TemplateRef<void>, options?: ZardContextMenuOptions) => void` | `-` |
| `close()` | Closes the open context menu. | `() => void` | `-` |
| `isOpen` | Whether a menu is currently on screen. | `Signal<boolean>` | `false` |

### z-dropdown-menu-content

The menu surface. Every item primitive below is declared inside it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-item

Clickable menu row that closes the menu after selection.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Visual type of the item. | `'default' \| 'destructive'` | `'default'` |
| `[zInset]` | Adds left padding for alignment. | `boolean` | `false` |
| `[zDisabled]` | Disables the item. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-sub-trigger

Menu row that opens a nested menu to its side, on hover, click or `ArrowRight`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSubMenu]` | Submenu content, exported as `zDropdownMenuSubContent`. | `ZardDropdownMenuSubContentComponent \| TemplateRef<unknown>` | `-` |
| `[zInset]` | Adds left padding for alignment. | `boolean` | `false` |
| `[zDisabled]` | Disables the sub-trigger. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-sub-content

Surface of a submenu. Declared next to its sub-trigger and referenced by it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-checkbox-item

Menu row with a checked state and `menuitemcheckbox` semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zChecked)]` | Checked state for the item. | `boolean` | `false` |
| `[zDisabled]` | Disables the item. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-group

Radio group wrapper for menu radio items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zValue)]` | Selected radio item value. | `string \| undefined` | `undefined` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-item

Menu row with `menuitemradio` semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zValue]` | Value represented by this radio item. | `string` | `-` |
| `[zDisabled]` | Disables the item. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-group

Groups related rows under a shared label.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-label

Label naming a group of rows.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[inset]` | Adds left padding for alignment. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-separator

Divider between menu sections.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-shortcut

Right-aligned keyboard hint inside a menu row.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/context-menu)
