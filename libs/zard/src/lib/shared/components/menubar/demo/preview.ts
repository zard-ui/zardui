import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-preview',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar class="w-72">
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent">
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>
          New Tab
          <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          New Window
          <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item zDisabled>New Incognito Window</z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">Share</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent">
        <z-dropdown-menu-item>Email link</z-dropdown-menu-item>
        <z-dropdown-menu-item>Messages</z-dropdown-menu-item>
        <z-dropdown-menu-item>Notes</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        Print...
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent">
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>
          Undo
          <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          Redo
          <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="findMenu">Find</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #findMenu="zDropdownMenuSubContent">
        <z-dropdown-menu-item>Search the web</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>Find...</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Next</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Previous</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
        <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
        <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
      </z-dropdown-menu-group>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-group>
        <z-dropdown-menu-checkbox-item [(zChecked)]="bookmarksBar">Bookmarks Bar</z-dropdown-menu-checkbox-item>
        <z-dropdown-menu-checkbox-item [(zChecked)]="fullUrls">Full URLs</z-dropdown-menu-checkbox-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-item zInset>
          Reload
          <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item zInset zDisabled>
          Force Reload
          <z-dropdown-menu-shortcut>⇧⌘R</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Toggle Fullscreen</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Hide Sidebar</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Edit...</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Add Profile...</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarPreviewComponent {
  protected readonly bookmarksBar = signal(false);
  protected readonly fullUrls = signal(true);
  protected readonly profile = signal('benoit');
}
