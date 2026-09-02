import { Component } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-basic-demo',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item (click)="log('Back')">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled>Forward</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">Reload</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuBasicDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
