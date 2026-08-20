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
