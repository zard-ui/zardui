import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCalculator,
  lucideCalendar,
  lucideClipboardPaste,
  lucideCode,
  lucideCopy,
  lucideCreditCard,
  lucideFileText,
  lucideFolder,
  lucideFolderPlus,
  lucideCircleHelp,
  lucideHouse,
  lucideImage,
  lucideInbox,
  lucideLayoutGrid,
  lucideList,
  lucidePlus,
  lucideScissors,
  lucideSettings,
  lucideSmile,
  lucideTrash,
  lucideUser,
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardCommandImports } from '@zard/components/command';
import { ZardDialogImports } from '@zard/components/dialog';

import { ExampleImports } from './example.component';

interface CommandEntry {
  readonly label: string;
  readonly icon?: string;
  readonly shortcut?: string;
}

interface CommandGroup {
  readonly heading: string;
  readonly items: readonly CommandEntry[];
}

const SUGGESTIONS: CommandGroup = {
  heading: 'Suggestions',
  items: [
    { label: 'Calendar', icon: 'lucideCalendar' },
    { label: 'Search Emoji', icon: 'lucideSmile' },
    { label: 'Calculator', icon: 'lucideCalculator' },
  ],
};

const SETTINGS: CommandGroup = {
  heading: 'Settings',
  items: [
    { label: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
    { label: 'Billing', icon: 'lucideCreditCard', shortcut: '⌘B' },
    { label: 'Settings', icon: 'lucideSettings', shortcut: '⌘S' },
  ],
};

const BASIC_GROUPS: readonly CommandGroup[] = [
  { heading: 'Suggestions', items: [{ label: 'Calendar' }, { label: 'Search Emoji' }, { label: 'Calculator' }] },
];

const SHORTCUT_GROUPS: readonly CommandGroup[] = [SETTINGS];

const GROUPED_GROUPS: readonly CommandGroup[] = [SUGGESTIONS, SETTINGS];

const MANY_GROUPS: readonly CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { label: 'Home', icon: 'lucideHouse', shortcut: '⌘H' },
      { label: 'Inbox', icon: 'lucideInbox', shortcut: '⌘I' },
      { label: 'Documents', icon: 'lucideFileText', shortcut: '⌘D' },
      { label: 'Folders', icon: 'lucideFolder', shortcut: '⌘F' },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { label: 'New File', icon: 'lucidePlus', shortcut: '⌘N' },
      { label: 'New Folder', icon: 'lucideFolderPlus', shortcut: '⇧⌘N' },
      { label: 'Copy', icon: 'lucideCopy', shortcut: '⌘C' },
      { label: 'Cut', icon: 'lucideScissors', shortcut: '⌘X' },
      { label: 'Paste', icon: 'lucideClipboardPaste', shortcut: '⌘V' },
      { label: 'Delete', icon: 'lucideTrash', shortcut: '⌫' },
    ],
  },
  {
    heading: 'View',
    items: [
      { label: 'Grid View', icon: 'lucideLayoutGrid' },
      { label: 'List View', icon: 'lucideList' },
      { label: 'Zoom In', icon: 'lucideZoomIn', shortcut: '⌘+' },
      { label: 'Zoom Out', icon: 'lucideZoomOut', shortcut: '⌘-' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
      { label: 'Billing', icon: 'lucideCreditCard', shortcut: '⌘B' },
      { label: 'Settings', icon: 'lucideSettings', shortcut: '⌘S' },
      { label: 'Notifications', icon: 'lucideBell' },
      { label: 'Help & Support', icon: 'lucideCircleHelp' },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { label: 'Calculator', icon: 'lucideCalculator' },
      { label: 'Calendar', icon: 'lucideCalendar' },
      { label: 'Image Editor', icon: 'lucideImage' },
      { label: 'Code Editor', icon: 'lucideCode' },
    ],
  },
];

/** shadcn/ui's `command-example`, in zard. */
@Component({
  selector: 'z-command-example',
  imports: [
    ExampleImports,
    NgTemplateOutlet,
    ZardButtonComponent,
    ZardCardImports,
    ZardCommandImports,
    ZardDialogImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideCalculator,
      lucideCalendar,
      lucideClipboardPaste,
      lucideCode,
      lucideCopy,
      lucideCreditCard,
      lucideFileText,
      lucideFolder,
      lucideFolderPlus,
      lucideCircleHelp,
      lucideHouse,
      lucideImage,
      lucideInbox,
      lucideLayoutGrid,
      lucideList,
      lucidePlus,
      lucideScissors,
      lucideSettings,
      lucideSmile,
      lucideTrash,
      lucideUser,
      lucideZoomIn,
      lucideZoomOut,
    }),
  ],
  template: `
    <!-- shadcn's Command: input, list, empty state and the groups split by separators. -->
    <ng-template #commandMenu let-groups let-commandClass="commandClass">
      <z-command #cmd="zCommand" [class]="commandClass">
        <z-command-input placeholder="Type a command or search..." />
        <z-command-list>
          @if (cmd.isEmpty()) {
            <div class="py-6 text-center text-sm">No results found.</div>
          }
          @for (group of groups; track group.heading; let first = $first) {
            @if (!first) {
              <z-command-divider />
            }
            <z-command-option-group [zLabel]="group.heading">
              @for (item of group.items; track item.label) {
                <z-command-option
                  [zLabel]="item.label"
                  [zValue]="item.label"
                  [zIcon]="item.icon"
                  [zShortcut]="item.shortcut ?? ''"
                />
              }
            </z-command-option-group>
          }
        </z-command-list>
      </z-command>
    </ng-template>

    <!-- shadcn's CommandDialog: a dialog without close button, pinned to the upper third. -->
    <ng-template #commandDialog let-groups let-open="open">
      <div class="flex flex-col gap-4">
        <button type="button" z-button zType="outline" class="w-fit" (click)="open.set(true)">Open Menu</button>
        <z-dialog
          class="top-1/3 translate-y-0 overflow-hidden p-0"
          [zClosable]="false"
          [zVisible]="open()"
          (zVisibleChange)="open.set($event)"
        >
          <z-dialog-header class="sr-only">
            <z-dialog-title>Command Palette</z-dialog-title>
            <z-dialog-description>Search for a command to run...</z-dialog-description>
          </z-dialog-header>
          <ng-container
            [ngTemplateOutlet]="commandMenu"
            [ngTemplateOutletContext]="{ $implicit: groups, commandClass: 'border-0 shadow-none' }"
          />
        </z-dialog>
      </div>
    </ng-template>

    <z-example-wrapper>
      <z-example zTitle="Inline">
        <z-card class="w-full p-0">
          <z-card-content class="p-0">
            <ng-container
              [ngTemplateOutlet]="commandMenu"
              [ngTemplateOutletContext]="{ $implicit: groupedGroups, commandClass: 'border-0 shadow-none' }"
            />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Basic">
        <ng-container
          [ngTemplateOutlet]="commandDialog"
          [ngTemplateOutletContext]="{ $implicit: basicGroups, open: basicOpen }"
        />
      </z-example>

      <z-example zTitle="With Shortcuts">
        <ng-container
          [ngTemplateOutlet]="commandDialog"
          [ngTemplateOutletContext]="{ $implicit: shortcutGroups, open: shortcutsOpen }"
        />
      </z-example>

      <z-example zTitle="With Groups">
        <ng-container
          [ngTemplateOutlet]="commandDialog"
          [ngTemplateOutletContext]="{ $implicit: groupedGroups, open: groupsOpen }"
        />
      </z-example>

      <z-example zTitle="Many Groups & Items">
        <ng-container
          [ngTemplateOutlet]="commandDialog"
          [ngTemplateOutletContext]="{ $implicit: manyGroups, open: manyOpen }"
        />
      </z-example>
    </z-example-wrapper>
  `,
})
export class CommandExampleComponent {
  protected readonly basicGroups = BASIC_GROUPS;
  protected readonly shortcutGroups = SHORTCUT_GROUPS;
  protected readonly groupedGroups = GROUPED_GROUPS;
  protected readonly manyGroups = MANY_GROUPS;

  protected readonly basicOpen = signal(false);
  protected readonly shortcutsOpen = signal(false);
  protected readonly groupsOpen = signal(false);
  protected readonly manyOpen = signal(false);
}
