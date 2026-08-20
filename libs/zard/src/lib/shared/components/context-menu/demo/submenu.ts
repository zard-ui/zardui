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
