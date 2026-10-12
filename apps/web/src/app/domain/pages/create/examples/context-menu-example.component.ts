import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideClipboardPaste,
  lucideCopy,
  lucidePencil,
  lucideScissors,
  lucideShare,
  lucideTrash,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardContextMenuImports } from '@zard/components/context-menu';
import { ZardDialogImports } from '@zard/components/dialog';

import { ExampleImports } from './example.component';

const MENU_SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** shadcn/ui's `context-menu-example`, in zard. */
@Component({
  selector: 'z-context-menu-example',
  imports: [ExampleImports, NgIcon, ZardButtonComponent, ZardContextMenuImports, ZardDialogImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArchive,
      lucideClipboardPaste,
      lucideCopy,
      lucidePencil,
      lucideScissors,
      lucideShare,
      lucideTrash,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="basicMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #basicMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>Back</z-dropdown-menu-item>
            <z-dropdown-menu-item disabled>Forward</z-dropdown-menu-item>
            <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Sides">
        <div class="grid grid-cols-2 gap-6">
          @for (side of sides; track side) {
            <div
              z-context-menu
              [zContextMenuTriggerFor]="sideMenu"
              class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
            >
              Right click ({{ side }})
            </div>
            <z-dropdown-menu-content #sideMenu="zDropdownMenuContent" [zSide]="side">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>Back</z-dropdown-menu-item>
                <z-dropdown-menu-item>Forward</z-dropdown-menu-item>
                <z-dropdown-menu-item>Reload</z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-content>
          }
        </div>
      </z-example>

      <z-example zTitle="With Icons">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="iconsMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #iconsMenu="zDropdownMenuContent">
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
          <z-dropdown-menu-group>
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideTrash" />
              Delete
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Shortcuts">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="shortcutsMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #shortcutsMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Back
              <z-dropdown-menu-shortcut>⌘[</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item disabled>
              Forward
              <z-dropdown-menu-shortcut>⌘]</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Reload
              <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Save
              <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Save As...
              <z-dropdown-menu-shortcut>⇧⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Submenu">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="submenuMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #submenuMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Copy
              <z-dropdown-menu-shortcut>⌘C</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Cut
              <z-dropdown-menu-shortcut>⌘X</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-sub-trigger [zSubMenu]="moreTools">More Tools</z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #moreTools="zDropdownMenuSubContent">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Save Page...</z-dropdown-menu-item>
              <z-dropdown-menu-item>Create Shortcut...</z-dropdown-menu-item>
              <z-dropdown-menu-item>Name Window...</z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>Developer Tools</z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item variant="destructive">Delete</z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-sub-content>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Groups, Labels & Separators">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="groupsMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #groupsMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>File</z-dropdown-menu-label>
            <z-dropdown-menu-item>
              New File
              <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Open File
              <z-dropdown-menu-shortcut>⌘O</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Save
              <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Edit</z-dropdown-menu-label>
            <z-dropdown-menu-item>
              Undo
              <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Redo
              <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-separator />
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
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item variant="destructive">
              Delete
              <z-dropdown-menu-shortcut>⌫</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Checkboxes">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="checkboxesMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #checkboxesMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarksBar">
              Show Bookmarks Bar
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">Show Full URLs</z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="showDeveloperTools">
              Show Developer Tools
            </z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Radio Group">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="radioMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #radioMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>People</z-dropdown-menu-label>
            <z-dropdown-menu-radio-group [(zValue)]="user">
              <z-dropdown-menu-radio-item zValue="pedro">Pedro Duarte</z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="colm">Colm Tuite</z-dropdown-menu-radio-item>
            </z-dropdown-menu-radio-group>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Theme</z-dropdown-menu-label>
            <z-dropdown-menu-radio-group [(zValue)]="theme">
              <z-dropdown-menu-radio-item zValue="light">Light</z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="dark">Dark</z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="system">System</z-dropdown-menu-radio-item>
            </z-dropdown-menu-radio-group>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Destructive Items">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="destructiveMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #destructiveMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucidePencil" />
              Edit
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideShare" />
              Share
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideArchive" />
              Archive
            </z-dropdown-menu-item>
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
            <z-dialog-title>Context Menu Example</z-dialog-title>
            <z-dialog-description>Right click on the area below to see the context menu.</z-dialog-description>
          </z-dialog-header>
          <div
            z-context-menu
            [zContextMenuTriggerFor]="dialogMenu"
            class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
          <z-dropdown-menu-content #dialogMenu="zDropdownMenuContent">
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
            <z-dropdown-menu-sub-trigger [zSubMenu]="dialogMoreOptions">More Options</z-dropdown-menu-sub-trigger>
            <z-dropdown-menu-sub-content #dialogMoreOptions="zDropdownMenuSubContent">
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
        </z-dialog>
      </z-example>

      <z-example zTitle="With Inset">
        <div
          z-context-menu
          [zContextMenuTriggerFor]="insetMenu"
          class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
        >
          Right click here
        </div>
        <z-dropdown-menu-content #insetMenu="zDropdownMenuContent" class="w-44">
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
          <z-dropdown-menu-sub-trigger zInset [zSubMenu]="insetMoreOptions">More Options</z-dropdown-menu-sub-trigger>
          <z-dropdown-menu-sub-content #insetMoreOptions="zDropdownMenuSubContent">
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
export class ContextMenuExampleComponent {
  protected readonly sides = MENU_SIDES;

  protected readonly showBookmarksBar = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly showDeveloperTools = signal(false);

  protected readonly user = signal<string | undefined>('pedro');
  protected readonly theme = signal<string | undefined>('light');

  protected readonly dialogOpen = signal(false);

  protected readonly insetBookmarks = signal(true);
  protected readonly insetUrls = signal(false);
  protected readonly insetTheme = signal<string | undefined>('system');
}
