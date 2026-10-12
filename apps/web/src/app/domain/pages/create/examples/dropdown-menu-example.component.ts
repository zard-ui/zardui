import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArchive,
  lucideArrowDown,
  lucideArrowRight,
  lucideArrowUp,
  lucideBadgeCheck,
  lucideBell,
  lucideBuilding2,
  lucideChevronsUpDown,
  lucideClipboardPaste,
  lucideCopy,
  lucideCreditCard,
  lucideCircleHelp,
  lucideLayout,
  lucideLogOut,
  lucideMail,
  lucideMessageSquare,
  lucidePanelLeft,
  lucidePencil,
  lucideCirclePlus,
  lucideScissors,
  lucideSettings,
  lucideShare,
  lucideTrash,
  lucideUser,
  lucideUsers,
  lucideWallet,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@zard/components/avatar';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardDropdownImports } from '@zard/components/dropdown';

import { ExampleImports } from './example.component';

/** shadcn/ui's `dropdown-menu-example`, in zard. */
@Component({
  selector: 'z-dropdown-menu-example',
  imports: [ExampleImports, NgIcon, ZardAvatarComponent, ZardButtonComponent, ZardDialogImports, ZardDropdownImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideArchive,
      lucideArrowDown,
      lucideArrowRight,
      lucideArrowUp,
      lucideBadgeCheck,
      lucideBell,
      lucideBuilding2,
      lucideChevronsUpDown,
      lucideClipboardPaste,
      lucideCopy,
      lucideCreditCard,
      lucideCircleHelp,
      lucideLayout,
      lucideLogOut,
      lucideMail,
      lucideMessageSquare,
      lucidePanelLeft,
      lucidePencil,
      lucideCirclePlus,
      lucideScissors,
      lucideSettings,
      lucideShare,
      lucideTrash,
      lucideUser,
      lucideUsers,
      lucideWallet,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="basicMenu">
          Open
        </button>
        <z-dropdown-menu-content #basicMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
            <z-dropdown-menu-item>Profile</z-dropdown-menu-item>
            <z-dropdown-menu-item>Billing</z-dropdown-menu-item>
            <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>GitHub</z-dropdown-menu-item>
            <z-dropdown-menu-item disabled>API</z-dropdown-menu-item>
            <z-dropdown-menu-item>Support</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Complex">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="complexMenu">
          Complex Menu
        </button>
        <z-dropdown-menu-content #complexMenu="zDropdownMenuContent" class="w-56">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
            <z-dropdown-menu-item>
              <ng-icon name="lucideUser" />
              Profile
              <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCreditCard" />
              Billing
              <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideSettings" />
              Settings
              <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>View</z-dropdown-menu-label>
            <z-dropdown-menu-checkbox-item [(zChecked)]="complexSidebar">
              <ng-icon name="lucidePanelLeft" />
              Sidebar
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="complexStatusBar">
              <ng-icon name="lucideLayout" />
              Status Bar
            </z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-sub-trigger [zSubMenu]="complexInvite">
              <ng-icon name="lucideUsers" />
              Invite Users
            </z-dropdown-menu-sub-trigger>
            <z-dropdown-menu-sub-content #complexInvite="zDropdownMenuSubContent">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideMail" />
                  Email
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideMessageSquare" />
                  Message
                </z-dropdown-menu-item>
              </z-dropdown-menu-group>
              <z-dropdown-menu-separator />
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideCirclePlus" />
                  More...
                </z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-sub-content>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCircleHelp" />
              Support
            </z-dropdown-menu-item>
            <z-dropdown-menu-item variant="destructive">
              <ng-icon name="lucideLogOut" />
              Sign Out
              <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Icons">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="iconsMenu">
          Open
        </button>
        <z-dropdown-menu-content #iconsMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              <ng-icon name="lucideUser" />
              Profile
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              <ng-icon name="lucideCreditCard" />
              Billing
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
              Log out
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Shortcuts">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="shortcutsMenu">
          Open
        </button>
        <z-dropdown-menu-content #shortcutsMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
            <z-dropdown-menu-item>
              Profile
              <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Billing
              <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Settings
              <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
            <z-dropdown-menu-item>
              Shortcuts
              <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>
              Log out
              <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Submenu">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="submenuMenu">
          Open
        </button>
        <z-dropdown-menu-content #submenuMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>Team</z-dropdown-menu-item>
            <z-dropdown-menu-sub-trigger [zSubMenu]="inviteUsers">Invite users</z-dropdown-menu-sub-trigger>
            <z-dropdown-menu-sub-content #inviteUsers="zDropdownMenuSubContent">
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>Email</z-dropdown-menu-item>
                <z-dropdown-menu-item>Message</z-dropdown-menu-item>
              </z-dropdown-menu-group>
              <z-dropdown-menu-separator />
              <z-dropdown-menu-group>
                <z-dropdown-menu-item>More...</z-dropdown-menu-item>
              </z-dropdown-menu-group>
            </z-dropdown-menu-sub-content>
            <z-dropdown-menu-item>
              New Team
              <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
            </z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Checkboxes">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="checkboxesMenu">
          Checkboxes
        </button>
        <z-dropdown-menu-content #checkboxesMenu="zDropdownMenuContent" class="min-w-40">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Appearance</z-dropdown-menu-label>
            <z-dropdown-menu-checkbox-item [(zChecked)]="showStatusBar">
              <ng-icon name="lucideLayout" />
              Status Bar
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item disabled [(zChecked)]="showActivityBar">
              <ng-icon name="lucideActivity" />
              Activity Bar
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="showPanel">
              <ng-icon name="lucidePanelLeft" />
              Panel
            </z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Checkboxes with Icons">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="notificationsMenu">
          Notifications
        </button>
        <z-dropdown-menu-content #notificationsMenu="zDropdownMenuContent" class="min-w-56">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Notification Preferences</z-dropdown-menu-label>
            <z-dropdown-menu-checkbox-item [(zChecked)]="emailNotifications">
              <ng-icon name="lucideMail" />
              Email notifications
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="smsNotifications">
              <ng-icon name="lucideMessageSquare" />
              SMS notifications
            </z-dropdown-menu-checkbox-item>
            <z-dropdown-menu-checkbox-item [(zChecked)]="pushNotifications">
              <ng-icon name="lucideBell" />
              Push notifications
            </z-dropdown-menu-checkbox-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Radio Group">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="radioMenu">
          Radio Group
        </button>
        <z-dropdown-menu-content #radioMenu="zDropdownMenuContent">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Panel Position</z-dropdown-menu-label>
            <z-dropdown-menu-radio-group [(zValue)]="position">
              <z-dropdown-menu-radio-item zValue="top">
                <ng-icon name="lucideArrowUp" />
                Top
              </z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="bottom">
                <ng-icon name="lucideArrowDown" />
                Bottom
              </z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="right" disabled>
                <ng-icon name="lucideArrowRight" />
                Right
              </z-dropdown-menu-radio-item>
            </z-dropdown-menu-radio-group>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="Radio with Icons">
        <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="paymentMenu">Payment Method</button>
        <z-dropdown-menu-content #paymentMenu="zDropdownMenuContent" class="min-w-56">
          <z-dropdown-menu-group>
            <z-dropdown-menu-label>Select Payment Method</z-dropdown-menu-label>
            <z-dropdown-menu-radio-group [(zValue)]="paymentMethod">
              <z-dropdown-menu-radio-item zValue="card">
                <ng-icon name="lucideCreditCard" />
                Credit Card
              </z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="paypal">
                <ng-icon name="lucideWallet" />
                PayPal
              </z-dropdown-menu-radio-item>
              <z-dropdown-menu-radio-item zValue="bank">
                <ng-icon name="lucideBuilding2" />
                Bank Transfer
              </z-dropdown-menu-radio-item>
            </z-dropdown-menu-radio-group>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-example>

      <z-example zTitle="With Destructive Items">
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="destructiveMenu">
          Actions
        </button>
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

      <z-example zTitle="With Avatar">
        <div class="flex items-center justify-between gap-4">
          <button
            type="button"
            z-button
            zType="outline"
            class="style-sera:font-normal style-sera:tracking-normal style-sera:normal-case h-12 justify-start px-2 md:max-w-[200px]"
            z-dropdown
            [zDropdownMenu]="avatarMenu"
          >
            <z-avatar zSrc="https://github.com/shadcn.png" zAlt="Shadcn" zFallback="CN" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">shadcn</span>
              <span class="text-muted-foreground truncate text-xs">shadcn@example.com</span>
            </div>
            <ng-icon name="lucideChevronsUpDown" class="text-muted-foreground ml-auto" />
          </button>
          <z-dropdown-menu-content
            #avatarMenu="zDropdownMenuContent"
            class="w-(--z-dropdown-menu-trigger-width) min-w-56"
          >
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>
                <ng-icon name="lucideBadgeCheck" />
                Account
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideCreditCard" />
                Billing
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideBell" />
                Notifications
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>
                <ng-icon name="lucideLogOut" />
                Sign Out
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-content>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon"
            class="rounded-full"
            z-dropdown
            [zDropdownMenu]="avatarIconMenu"
          >
            <z-avatar zSrc="https://github.com/shadcn.png" zAlt="shadcn" zFallback="LR" />
          </button>
          <z-dropdown-menu-content #avatarIconMenu="zDropdownMenuContent" zAlign="end" zSide="top">
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>
                <ng-icon name="lucideBadgeCheck" />
                Account
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideCreditCard" />
                Billing
              </z-dropdown-menu-item>
              <z-dropdown-menu-item>
                <ng-icon name="lucideBell" />
                Notifications
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-group>
              <z-dropdown-menu-item>
                <ng-icon name="lucideLogOut" />
                Sign Out
              </z-dropdown-menu-item>
            </z-dropdown-menu-group>
          </z-dropdown-menu-content>
        </div>
      </z-example>

      <z-example zTitle="In Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Dropdown Menu Example</z-dialog-title>
            <z-dialog-description>Click the button below to see the dropdown menu.</z-dialog-description>
          </z-dialog-header>
          <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="dialogMenu">
            Open Menu
          </button>
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
        <button type="button" z-button zType="outline" class="w-fit" z-dropdown [zDropdownMenu]="insetMenu">
          Open
        </button>
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
export class DropdownMenuExampleComponent {
  protected readonly complexSidebar = signal(true);
  protected readonly complexStatusBar = signal(false);

  protected readonly showStatusBar = signal(true);
  protected readonly showActivityBar = signal(false);
  protected readonly showPanel = signal(false);

  protected readonly emailNotifications = signal(true);
  protected readonly smsNotifications = signal(false);
  protected readonly pushNotifications = signal(true);

  protected readonly position = signal<string | undefined>('bottom');
  protected readonly paymentMethod = signal<string | undefined>('card');

  protected readonly dialogOpen = signal(false);

  protected readonly insetBookmarks = signal(true);
  protected readonly insetUrls = signal(false);
  protected readonly insetTheme = signal<string | undefined>('system');
}
