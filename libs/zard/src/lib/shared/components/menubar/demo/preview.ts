import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-preview',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>New Tab</z-dropdown-menu-item>
      <z-dropdown-menu-item>New Window</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Print...</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>Undo</z-dropdown-menu-item>
      <z-dropdown-menu-item>Redo</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
      <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
      <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
      <z-dropdown-menu-item>Toggle Fullscreen</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarPreviewComponent {}
