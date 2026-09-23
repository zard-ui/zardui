import { Component, signal } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';

@Component({
  selector: 'z-context-menu-radio-demo',
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
      <z-dropdown-menu-radio-group [(zValue)]="person">
        <z-dropdown-menu-label>People</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="pedro">Pedro Duarte</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="colm">Colm Tuite</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-radio-group [(zValue)]="theme">
        <z-dropdown-menu-label>Theme</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuRadioDemoComponent {
  readonly person = signal('pedro');
  readonly theme = signal('light');
}
