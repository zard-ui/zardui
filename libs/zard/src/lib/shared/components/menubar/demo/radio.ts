import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-radio',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar class="w-72">
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="themeMenu">Theme</button>
    </z-menubar>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="user">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Edit...</z-dropdown-menu-item>
      <z-dropdown-menu-item zInset>Add Profile...</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #themeMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="theme">
        <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarRadioComponent {
  protected readonly user = signal('benoit');
  protected readonly theme = signal('system');
}
