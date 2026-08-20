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
