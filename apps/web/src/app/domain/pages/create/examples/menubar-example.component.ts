import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBold,
  lucideCheck,
  lucideCircleDashed,
  lucideClipboardPaste,
  lucideCopy,
  lucideFile,
  lucideFolder,
  lucideImage,
  lucideItalic,
  lucideLink,
  lucideLogOut,
  lucideSave,
  lucideScissors,
  lucideSearch,
  lucideSettings,
  lucideTable,
  lucideTrash,
  lucideUnderline,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardMenubarImports } from '@zard/components/menubar';

import { ExampleImports } from './example.component';

const SIDES = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;

/** shadcn/ui's `menubar-example`, in zard. */
@Component({
  selector: 'z-menubar-example',
  imports: [ExampleImports, NgIcon, ZardButtonComponent, ZardDialogImports, ZardMenubarImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBold,
      lucideCheck,
      lucideCircleDashed,
      lucideClipboardPaste,
      lucideCopy,
      lucideFile,
      lucideFolder,
      lucideImage,
      lucideItalic,
      lucideLink,
      lucideLogOut,
      lucideSave,
      lucideScissors,
      lucideSearch,
      lucideSettings,
      lucideTable,
      lucideTrash,
      lucideUnderline,
      lucideUser,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="basicFile">File</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="basicEdit">Edit</button>
        </z-menubar>
        <z-dropdown-menu-content #basicFile="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              New Tab
              <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              New Window
              <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item disabled>New Incognito Window</z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Print...
              <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #basicEdit="zDropdownMenuContent">
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
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
            <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
            <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Submenu">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="subFile">File</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="subEdit">Edit</button>
        </z-menubar>
        <z-dropdown-menu-content #subFile="zDropdownMenuContent">
          <z-dropdown-menu-sub-trigger [zSubMenu]="subShare">Share</z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #subShare="zDropdownMenuSubContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Email link</z-dropdown-menu-item>
              <z-dropdown-menu-item>Messages</z-dropdown-menu-item>
              <z-dropdown-menu-item>Notes</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-sub-content>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Print...
              <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #subEdit="zDropdownMenuContent">
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
          <z-dropdown-menu-sub-trigger [zSubMenu]="subFind">Find</z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #subFind="zDropdownMenuSubContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Find...</z-dropdown-menu-item>
              <z-dropdown-menu-item>Find Next</z-dropdown-menu-item>
              <z-dropdown-menu-item>Find Previous</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-sub-content>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
            <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
            <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Sides" zContainerClass="col-span-2">
        <div class="flex flex-wrap justify-center gap-2">
          @for (side of sides; track side) {
            <z-menubar>
              <button type="button" z-menubar-trigger class="capitalize" [zMenubarMenu]="sideMenu">
                {{ label(side) }}
              </button>
            </z-menubar>
            <z-dropdown-menu-content #sideMenu="zDropdownMenuContent" [zSide]="side">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>New Tab</z-dropdown-menu-item>
                <z-dropdown-menu-item>New Window</z-dropdown-menu-item>
                <z-dropdown-menu-item>New Incognito Window</z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-content>
          }
        </div>
      </z-example>

      <z-example zTitle="With Checkboxes">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="checkView">View</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="checkFormat">Format</button>
        </z-menubar>
        <z-dropdown-menu-content #checkView="zDropdownMenuContent" class="w-64">
          <z-dropdown-menu-group>
            <z-dropdown-menu-checkbox-item [(zChecked)]="checkBookmarks">
              Always Show Bookmarks Bar
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="checkUrls">
              Always Show Full URLs
            </z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item inset>
              Reload
              <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item disabled inset>
              Force Reload
              <z-dropdown-menu-shortcut>⇧⌘R</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #checkFormat="zDropdownMenuContent">
          <z-dropdown-menu-checkbox-item [(zChecked)]="checkStrike">Strikethrough</z-dropdown-menu-checkbox-item>
          <z-dropdown-menu-checkbox-item [(zChecked)]="checkCode">Code</z-dropdown-menu-checkbox-item>
          <z-dropdown-menu-checkbox-item [(zChecked)]="checkSuper">Superscript</z-dropdown-menu-checkbox-item>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Radio">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="radioProfiles">Profiles</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="radioTheme">Theme</button>
        </z-menubar>
        <z-dropdown-menu-content #radioProfiles="zDropdownMenuContent">
          <z-dropdown-menu-radio-group [(zValue)]="user">
            <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
            <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
            <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
          </z-dropdown-menu-radio-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item inset>Edit...</z-dropdown-menu-item>
            <z-dropdown-menu-item inset>Add Profile...</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #radioTheme="zDropdownMenuContent">
          <z-dropdown-menu-radio-group [(zValue)]="theme">
            <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
            <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
            <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
          </z-dropdown-menu-radio-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Icons">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="iconsFile">File</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="iconsMore">More</button>
        </z-menubar>
        <z-dropdown-menu-content #iconsFile="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideFile" />
              New File
              <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideFolder" />
              Open Folder
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideSave" />
              Save
              <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #iconsMore="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCircleDashed" />
              Settings
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCircleDashed" />
              Help
            </z-dropdown-menu-item>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideCircleDashed" />
              Delete
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Shortcuts">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="shortFile">File</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="shortEdit">Edit</button>
        </z-menubar>
        <z-dropdown-menu-content #shortFile="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              New Tab
              <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              New Window
              <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Print...
              <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #shortEdit="zDropdownMenuContent">
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
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Cut
              <z-dropdown-menu-shortcut>⌘X</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Copy
              <z-dropdown-menu-shortcut>⌘C</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Paste
              <z-dropdown-menu-shortcut>⌘V</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Format">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="formatFormat">Format</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="formatView">View</button>
        </z-menubar>
        <z-dropdown-menu-content #formatFormat="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideBold" />
              Bold
              <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideItalic" />
              Italic
              <z-dropdown-menu-shortcut>⌘I</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideUnderline" />
              Underline
              <z-dropdown-menu-shortcut>⌘U</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-checkbox-item [(zChecked)]="formatStrike">Strikethrough</z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="formatCode">Code</z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #formatView="zDropdownMenuContent">
          <z-dropdown-menu-checkbox-item [(zChecked)]="formatRuler">Show Ruler</z-dropdown-menu-checkbox-item>
          <z-dropdown-menu-checkbox-item [(zChecked)]="formatGrid">Show Grid</z-dropdown-menu-checkbox-item>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item inset>Zoom In</z-dropdown-menu-item>
            <z-dropdown-menu-item inset>Zoom Out</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Insert">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="insertInsert">Insert</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="insertTools">Tools</button>
        </z-menubar>
        <z-dropdown-menu-content #insertInsert="zDropdownMenuContent">
          <z-dropdown-menu-sub-trigger [zSubMenu]="insertMedia">
            <ng-icon name="lucideImage" />
            Media
          </z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #insertMedia="zDropdownMenuSubContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Image</z-dropdown-menu-item>
              <z-dropdown-menu-item>Video</z-dropdown-menu-item>
              <z-dropdown-menu-item>Audio</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-sub-content>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideLink" />
              Link
              <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideTable" />
              Table
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #insertTools="zDropdownMenuContent" class="w-44">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideSearch" />
              Find & Replace
              <z-dropdown-menu-shortcut>⌘F</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCheck" />
              Spell Check
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Destructive">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="destFile">File</button>
          <button type="button" z-menubar-trigger [zMenubarMenu]="destAccount">Account</button>
        </z-menubar>
        <z-dropdown-menu-content #destFile="zDropdownMenuContent" class="w-40">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideFile" />
              New File
              <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideFolder" />
              Open Folder
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideTrash" />
              Delete File
              <z-dropdown-menu-shortcut>⌘⌫</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
        <z-dropdown-menu-content #destAccount="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideUser" />
              Profile
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideSettings" />
              Settings
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideLogOut" />
              Sign out
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideTrash" />
              Delete
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="In Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Menubar Example</z-dialog-title>
            <z-dialog-description>Use the menubar below to see the menu options.</z-dialog-description>
          </z-dialog-header>
          <z-menubar>
            <button type="button" z-menubar-trigger [zMenubarMenu]="dialogFile">File</button>
            <button type="button" z-menubar-trigger [zMenubarMenu]="dialogEdit">Edit</button>
          </z-menubar>
          <z-dropdown-menu-content #dialogFile="zDropdownMenuContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>
                <ng-icon name="lucideCopy" />
                Copy
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideScissors" />
                Cut
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideClipboardPaste" />
                Paste
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-sub-trigger [zSubMenu]="dialogMore">More Options</z-dropdown-menu-sub-trigger>
            <z-dropdown-menu-sub-content #dialogMore="zDropdownMenuSubContent">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>Save Page...</z-dropdown-menu-item>
                <z-dropdown-menu-item>Create Shortcut...</z-dropdown-menu-item>
                <z-dropdown-menu-item>Name Window...</z-dropdown-menu-item>
              </z-dropdown-menu-group>
              <z-dropdown-menu-separator />
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>Developer Tools</z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-sub-content>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item variant="destructive">
                <ng-icon name="lucideTrash" />
                Delete
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-content>
          <z-dropdown-menu-content #dialogEdit="zDropdownMenuContent">
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
          </z-dropdown-menu-content>
        </z-dialog>
      </z-example>

      <z-example zTitle="With Inset">
        <z-menubar>
          <button type="button" z-menubar-trigger [zMenubarMenu]="insetView">View</button>
        </z-menubar>
        <z-dropdown-menu-content #insetView="zDropdownMenuContent" class="w-44">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Actions</z-dropdown-menu-label>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCopy" />
              Copy
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideScissors" />
              Cut
            </z-dropdown-menu-item>
            <z-dropdown-menu-item inset>Paste</z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-label inset>Appearance</z-dropdown-menu-label>
            <z-dropdown-menu-checkbox-item [(zChecked)]="insetBookmarks">Bookmarks</z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="insetUrls">Full URLs</z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-label inset>Theme</z-dropdown-menu-label>
            <z-dropdown-menu-radio-group [(zValue)]="insetTheme">
              <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
            </z-dropdown-menu-radio-group>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-sub-trigger zInset [zSubMenu]="insetMore">More Options</z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #insetMore="zDropdownMenuSubContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Save Page...</z-dropdown-menu-item>
              <z-dropdown-menu-item>Create Shortcut...</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-sub-content>
        </z-dropdown-menu-content>
      </z-example>
    </z-example-wrapper>
  `,
})
export class MenubarExampleComponent {
  protected readonly sides = SIDES;

  protected label(side: string): string {
    return side.replace('-', ' ');
  }

  protected readonly checkBookmarks = signal(false);
  protected readonly checkUrls = signal(true);
  protected readonly checkStrike = signal(true);
  protected readonly checkCode = signal(false);
  protected readonly checkSuper = signal(false);

  protected readonly user = signal('benoit');
  protected readonly theme = signal('system');

  protected readonly formatStrike = signal(true);
  protected readonly formatCode = signal(false);
  protected readonly formatRuler = signal(false);
  protected readonly formatGrid = signal(true);

  protected readonly insetBookmarks = signal(true);
  protected readonly insetUrls = signal(false);
  protected readonly insetTheme = signal('system');

  protected readonly dialogOpen = signal(false);
}
