import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleHelp, lucideFile, lucideFolder, lucideSave, lucideSettings, lucideTrash } from '@ng-icons/lucide';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-icons',
  imports: [ZardMenubarImports, NgIcon],
  template: `
    <z-menubar class="w-72">
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="moreMenu">More</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent">
      <z-dropdown-menu-item>
        <ng-icon name="lucideFile" />
        New File
        <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        <ng-icon name="lucideFolder" />
        Open Folder
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        <ng-icon name="lucideSave" />
        Save
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #moreMenu="zDropdownMenuContent">
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>
          <ng-icon name="lucideSettings" />
          Settings
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCircleHelp" />
          Help
        </z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item zType="destructive">
          <ng-icon name="lucideTrash" />
          Delete
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideFile, lucideFolder, lucideSave, lucideSettings, lucideCircleHelp, lucideTrash }),
  ],
})
export class ZardDemoMenubarIconsComponent {}
