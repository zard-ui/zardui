import { Component, signal } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-demo',
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

      <z-dropdown-menu-separator />
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">Show Bookmarks</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Show Full URLs</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-radio-group [(zValue)]="person">
        <z-dropdown-menu-label>People</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="pedro">Pedro Duarte</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="colm">Colm Tuite</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuDemoComponent {
  readonly showBookmarks = signal(true);
  readonly showFullUrls = signal(false);
  readonly person = signal('pedro');

  log(item: string) {
    console.log(`${item} clicked`);
  }
}
