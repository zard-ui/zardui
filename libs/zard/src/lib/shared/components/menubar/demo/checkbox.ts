import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-checkbox',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar class="w-72">
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="formatMenu">Format</button>
    </z-menubar>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        Always Show Bookmarks Bar
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Always Show Full URLs</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>
        Reload
        <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item zInset zDisabled>
        Force Reload
        <z-dropdown-menu-shortcut>⇧⌘R</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #formatMenu="zDropdownMenuContent">
      <z-dropdown-menu-checkbox-item [(zChecked)]="strikethrough">Strikethrough</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="code">Code</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="superscript">Superscript</z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarCheckboxComponent {
  protected readonly showBookmarks = signal(false);
  protected readonly showFullUrls = signal(true);
  protected readonly strikethrough = signal(true);
  protected readonly code = signal(false);
  protected readonly superscript = signal(false);
}
