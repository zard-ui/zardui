import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAppWindow,
  lucideCode,
  lucideHouse,
  lucideMoreHorizontal,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardTabsImports } from '@zard/components/tabs';

import { ExampleImports } from './example.component';

/** The bordered box shadcn draws around the tab panels, per style. */
const PANEL_BOX =
  'border style-vega:rounded-lg style-vega:p-6 style-nova:rounded-lg style-nova:p-4 style-lyra:rounded-none style-lyra:p-4 style-maia:rounded-xl style-maia:p-6 style-mira:rounded-md style-mira:p-4 style-luma:rounded-xl style-luma:p-6 style-sera:rounded-none style-sera:p-6 style-rhea:rounded-xl style-rhea:p-6';

/**
 * shadcn/ui's `tabs-example`, in zard.
 *
 * zard's tab group draws its own list and panels, so shadcn's bordered panel box wraps each tab's content, and the
 * controls shadcn sets beside the list (dropdown, search) sit over the right end of the list's row.
 */
@Component({
  selector: 'z-tabs-example',
  imports: [ExampleImports, NgIcon, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, ZardTabsImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideAppWindow, lucideCode, lucideHouse, lucideMoreHorizontal, lucideSearch, lucideSettings }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-tab-group>
          <z-tab label="Home" />
          <z-tab label="Settings" />
        </z-tab-group>
      </z-example>

      <z-example zTitle="Line">
        <z-tab-group zVariant="line">
          <z-tab label="Overview" />
          <z-tab label="Analytics" />
          <z-tab label="Reports" />
        </z-tab-group>
      </z-example>

      <z-example zTitle="Variants Alignment">
        <div class="flex gap-4">
          <z-tab-group>
            <z-tab label="Overview" />
            <z-tab label="Analytics" />
          </z-tab-group>
          <z-tab-group zVariant="line">
            <z-tab label="Overview" />
            <z-tab label="Analytics" />
          </z-tab-group>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <z-tab-group>
          <z-tab label="Home" />
          <z-tab label="Disabled" zDisabled />
        </z-tab-group>
      </z-example>

      <z-example zTitle="With Icons">
        <z-tab-group>
          <z-tab label="Preview" zIcon="lucideAppWindow" />
          <z-tab label="Code" zIcon="lucideCode" />
        </z-tab-group>
      </z-example>

      <z-example zTitle="Icon Only">
        <z-tab-group>
          <z-tab label="" zIcon="lucideHouse" />
          <z-tab label="" zIcon="lucideSearch" />
          <z-tab label="" zIcon="lucideSettings" />
        </z-tab-group>
      </z-example>

      <z-example zTitle="Multiple">
        <z-tab-group>
          <z-tab label="Overview" />
          <z-tab label="Analytics" />
          <z-tab label="Reports" />
          <z-tab label="Settings" />
        </z-tab-group>
      </z-example>

      <z-example zTitle="With Content">
        <z-tab-group>
          <z-tab label="Account">
            <div [class]="panelBox">Manage your account preferences and profile information.</div>
          </z-tab>
          <z-tab label="Password">
            <div [class]="panelBox">Update your password to keep your account secure.</div>
          </z-tab>
          <z-tab label="Notifications">
            <div [class]="panelBox">Configure how you receive notifications and alerts.</div>
          </z-tab>
        </z-tab-group>
      </z-example>

      <z-example zTitle="Line With Content">
        <z-tab-group zVariant="line">
          <z-tab label="Account">
            <div [class]="panelBox">Manage your account preferences and profile information.</div>
          </z-tab>
          <z-tab label="Password">
            <div [class]="panelBox">Update your password to keep your account secure.</div>
          </z-tab>
          <z-tab label="Notifications">
            <div [class]="panelBox">Configure how you receive notifications and alerts.</div>
          </z-tab>
        </z-tab-group>
      </z-example>

      <z-example zTitle="Line Disabled">
        <z-tab-group zVariant="line">
          <z-tab label="Overview" />
          <z-tab label="Analytics" />
          <z-tab label="Reports" zDisabled />
        </z-tab-group>
      </z-example>

      <z-example zTitle="With Dropdown">
        <div class="relative w-full">
          <z-tab-group>
            <z-tab label="Overview">
              <div [class]="panelBox">View your dashboard metrics and key performance indicators.</div>
            </z-tab>
            <z-tab label="Analytics">
              <div [class]="panelBox">Detailed analytics and insights about your data.</div>
            </z-tab>
            <z-tab label="Reports">
              <div [class]="panelBox">Generate and view custom reports.</div>
            </z-tab>
          </z-tab-group>
          <div class="absolute top-0 right-0 flex h-9 items-center">
            <button type="button" z-button zType="ghost" zSize="icon" class="size-8" z-dropdown [zDropdownMenu]="more">
              <ng-icon name="lucideMoreHorizontal" />
              <span class="sr-only">More options</span>
            </button>
          </div>
          <z-dropdown-menu-content #more="zDropdownMenuContent" zAlign="end">
            <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
            <z-dropdown-menu-item>Export</z-dropdown-menu-item>
            <z-dropdown-menu-separator />
            <z-dropdown-menu-item>Archive</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </div>
      </z-example>

      <z-example zTitle="Vertical">
        <z-tab-group zOrientation="vertical">
          <z-tab label="Account">
            <div [class]="panelBox">Manage your account preferences and profile information.</div>
          </z-tab>
          <z-tab label="Password">
            <div [class]="panelBox">
              Update your password to keep your account secure. Use a strong password with a mix of letters, numbers,
              and symbols.
            </div>
          </z-tab>
          <z-tab label="Notifications">
            <div [class]="panelBox">
              Configure how you receive notifications and alerts. Choose which types of notifications you want to
              receive and how you want to receive them.
            </div>
          </z-tab>
        </z-tab-group>
      </z-example>

      <z-example zTitle="With Input and Button" zContainerClass="col-span-full">
        <div class="relative mx-auto w-full max-w-lg">
          <z-tab-group>
            <z-tab label="Overview">
              <div [class]="panelBox">View your dashboard metrics and key performance indicators.</div>
            </z-tab>
            <z-tab label="Analytics">
              <div [class]="panelBox">Detailed analytics and insights about your data.</div>
            </z-tab>
          </z-tab-group>
          <div class="absolute top-0 right-0 flex items-center gap-2">
            <input z-input placeholder="Search..." class="w-44" />
            <button type="button" z-button>Action</button>
          </div>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class TabsExampleComponent {
  protected readonly panelBox = PANEL_BOX;
}
