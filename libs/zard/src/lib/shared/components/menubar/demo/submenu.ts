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
