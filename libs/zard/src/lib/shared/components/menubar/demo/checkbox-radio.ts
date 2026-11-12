import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-checkbox-radio',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
    </z-menubar>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        Always Show Bookmarks Bar
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Always Show Full URLs</z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-label>Profiles</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarCheckboxRadioComponent {
  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly profile = signal('benoit');
}
