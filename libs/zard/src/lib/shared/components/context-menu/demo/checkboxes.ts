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
