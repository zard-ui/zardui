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
