import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowLeftRight,
  lucideBell,
  lucideBookOpen,
  lucideBuilding2,
  lucideChartPie,
  lucideCircleHelp,
  lucideCreditCard,
  lucideFileChartColumnIncreasing,
  lucideFileText,
  lucideLayoutDashboard,
  lucideMessageSquare,
  lucidePaintbrush,
  lucideShield,
  lucideTarget,
  lucideTrendingUp,
  lucideUser,
  lucideWallet,
} from '@ng-icons/lucide';

import { ZardCardImports } from '@zard/components/card';
import { ZardSidebarImports } from '@zard/components/sidebar';

interface NavGroup {
  readonly label: string;
  readonly items: readonly { readonly label: string; readonly icon: string; readonly active?: boolean }[];
}

/** Each card is one sidebar: a top group, a separator, a bottom group. */
const SIDEBARS: readonly (readonly [NavGroup, NavGroup])[] = [
  [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', icon: 'lucideLayoutDashboard', active: true },
        { label: 'Transactions', icon: 'lucideArrowLeftRight' },
        { label: 'Investments', icon: 'lucideTrendingUp' },
        { label: 'Accounts', icon: 'lucideBuilding2' },
        { label: 'Spending', icon: 'lucideChartPie' },
      ],
    },
    {
      label: 'Planning',
      items: [
        { label: 'Goals', icon: 'lucideTarget' },
        { label: 'Budget', icon: 'lucideWallet' },
        { label: 'Reports', icon: 'lucideFileChartColumnIncreasing' },
        { label: 'Documents', icon: 'lucideFileText' },
      ],
    },
  ],
  [
    {
      label: 'Account',
      items: [
        { label: 'Profile', icon: 'lucideUser' },
        { label: 'Billing', icon: 'lucideCreditCard', active: true },
        { label: 'Notifications', icon: 'lucideBell' },
        { label: 'Security', icon: 'lucideShield' },
        { label: 'Appearance', icon: 'lucidePaintbrush' },
      ],
    },
    {
      label: 'Support',
      items: [
        { label: 'Help Center', icon: 'lucideCircleHelp' },
        { label: 'Contact Us', icon: 'lucideMessageSquare' },
        { label: 'Documentation', icon: 'lucideBookOpen' },
        { label: 'Status', icon: 'lucideActivity' },
      ],
    },
  ],
];

@Component({
  selector: 'z-preview-01-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardSidebarImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideArrowLeftRight,
      lucideBell,
      lucideBookOpen,
      lucideBuilding2,
      lucideChartPie,
      lucideCircleHelp,
      lucideCreditCard,
      lucideFileChartColumnIncreasing,
      lucideFileText,
      lucideLayoutDashboard,
      lucideMessageSquare,
      lucidePaintbrush,
      lucideShield,
      lucideTarget,
      lucideTrendingUp,
      lucideUser,
      lucideWallet,
    }),
  ],
  template: `
    <div class="grid grid-cols-2 items-start gap-6">
      @for (sidebar of sidebars; track sidebar[0].label) {
        <z-card class="overflow-hidden py-0">
          <z-sidebar-provider class="min-h-0">
            <z-sidebar zCollapsible="none" class="w-full bg-transparent">
              <z-sidebar-content class="gap-0">
                @for (group of sidebar; track group.label; let first = $first) {
                  @if (!first) {
                    <z-sidebar-separator class="w-auto!" />
                  }
                  <z-sidebar-group [class]="first ? 'pb-1' : 'pt-1'">
                    <z-sidebar-group-label>{{ group.label }}</z-sidebar-group-label>
                    <z-sidebar-group-content>
                      <ul z-sidebar-menu>
                        @for (item of group.items; track item.label) {
                          <li z-sidebar-menu-item>
                            <button type="button" z-sidebar-menu-button [zActive]="!!item.active">
                              <ng-icon [name]="item.icon" />
                              {{ item.label }}
                            </button>
                          </li>
                        }
                      </ul>
                    </z-sidebar-group-content>
                  </z-sidebar-group>
                }
              </z-sidebar-content>
            </z-sidebar>
          </z-sidebar-provider>
        </z-card>
      }
    </div>
  `,
})
export class Preview01SidebarNavComponent {
  protected readonly sidebars = SIDEBARS;
}
