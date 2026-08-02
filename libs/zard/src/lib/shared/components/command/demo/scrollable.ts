import { type AfterViewInit, Component, inject, viewChild } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCalculator,
  lucideCalendar,
  lucideCircleHelp,
  lucideClipboardPaste,
  lucideCode,
  lucideCopy,
  lucideCreditCard,
  lucideFileText,
  lucideFolder,
  lucideFolderPlus,
  lucideHouse,
  lucideImage,
  lucideInbox,
  lucideLayoutGrid,
  lucideList,
  lucidePlus,
  lucideScissors,
  lucideSettings,
  lucideTrash2,
  lucideUser,
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-scrollable-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }

        <z-command-option-group zLabel="Navigation">
          <z-command-option zLabel="Home" zValue="home" zIcon="lucideHouse" zShortcut="⌘H" />
          <z-command-option zLabel="Inbox" zValue="inbox" zIcon="lucideInbox" zShortcut="⌘I" />
          <z-command-option zLabel="Documents" zValue="documents" zIcon="lucideFileText" zShortcut="⌘D" />
          <z-command-option zLabel="Folders" zValue="folders" zIcon="lucideFolder" zShortcut="⌘F" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Actions">
          <z-command-option zLabel="New File" zValue="new-file" zIcon="lucidePlus" zShortcut="⌘N" />
          <z-command-option zLabel="New Folder" zValue="new-folder" zIcon="lucideFolderPlus" zShortcut="⇧⌘N" />
          <z-command-option zLabel="Copy" zValue="copy" zIcon="lucideCopy" zShortcut="⌘C" />
          <z-command-option zLabel="Cut" zValue="cut" zIcon="lucideScissors" zShortcut="⌘X" />
          <z-command-option zLabel="Paste" zValue="paste" zIcon="lucideClipboardPaste" zShortcut="⌘V" />
          <z-command-option zLabel="Delete" zValue="delete" zIcon="lucideTrash2" zShortcut="⌫" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="View">
          <z-command-option zLabel="Grid View" zValue="grid" zIcon="lucideLayoutGrid" />
          <z-command-option zLabel="List View" zValue="list" zIcon="lucideList" />
          <z-command-option zLabel="Zoom In" zValue="zoom-in" zIcon="lucideZoomIn" zShortcut="⌘+" />
          <z-command-option zLabel="Zoom Out" zValue="zoom-out" zIcon="lucideZoomOut" zShortcut="⌘-" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Account">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
          <z-command-option zLabel="Notifications" zValue="notifications" zIcon="lucideBell" />
          <z-command-option zLabel="Help & Support" zValue="help" zIcon="lucideCircleHelp" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Tools">
          <z-command-option zLabel="Calculator" zValue="calculator" zIcon="lucideCalculator" />
          <z-command-option zLabel="Calendar" zValue="calendar" zIcon="lucideCalendar" />
          <z-command-option zLabel="Image Editor" zValue="image" zIcon="lucideImage" />
          <z-command-option zLabel="Code Editor" zValue="code" zIcon="lucideCode" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideFileText,
      lucideFolder,
      lucidePlus,
      lucideFolderPlus,
      lucideCopy,
      lucideScissors,
      lucideClipboardPaste,
      lucideTrash2,
      lucideLayoutGrid,
      lucideList,
      lucideZoomIn,
      lucideZoomOut,
      lucideUser,
      lucideCreditCard,
      lucideSettings,
      lucideBell,
      lucideCircleHelp,
      lucideCalculator,
      lucideCalendar,
      lucideImage,
      lucideCode,
    }),
  ],
})
class ZardDemoCommandScrollableDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-scrollable',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandScrollableComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandScrollableDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
