import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-demo-context-menu-disabled',
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      zDisabled
      [zContextMenuTriggerFor]="menu"
      class="text-muted-foreground flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      Right click for the browser menu
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-40">
      <z-dropdown-menu-item>Back</z-dropdown-menu-item>
      <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoContextMenuDisabledComponent {}
