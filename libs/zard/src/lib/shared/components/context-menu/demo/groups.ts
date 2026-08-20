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
