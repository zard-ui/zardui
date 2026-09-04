import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowLeftRight,
  lucideBell,
  lucideBookOpen,
  lucideCalendar,
  lucideChartColumn,
  lucideChartNoAxesColumn,
  lucideChartPie,
  lucideCircleHelp,
  lucideCreditCard,
  lucideFileText,
  lucideGlobe,
  lucideLandmark,
  lucideMessageCircle,
  lucidePalette,
  lucideShield,
  lucideTarget,
  lucideTrendingUp,
  lucideUser,
  lucideWallet,
} from '@ng-icons/lucide';

import { ZardCardImports } from '@zard/components/card/card.imports';

interface NavEntry {
  readonly label: string;
  readonly icon: string;
  readonly active?: boolean;
}

interface NavSection {
  readonly label: string;
  readonly entries: readonly NavEntry[];
  readonly placement: string;
}

@Component({
  selector: 'z-card-sidebar-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideActivity,
      lucideArrowLeftRight,
      lucideBell,
      lucideBookOpen,
      lucideCalendar,
      lucideChartColumn,
      lucideChartNoAxesColumn,
      lucideChartPie,
      lucideCircleHelp,
      lucideCreditCard,
      lucideFileText,
      lucideGlobe,
      lucideLandmark,
      lucideMessageCircle,
      lucidePalette,
      lucideShield,
      lucideTarget,
      lucideTrendingUp,
      lucideUser,
      lucideWallet,
    }),
  ],
  host: { class: 'block w-full' },
  template: `
    <div class="grid w-full grid-cols-2 gap-4 xl:gap-6">
      @for (section of sections; track section.label) {
        <z-card [class]="'overflow-hidden rounded-[22px]! py-0! ' + section.placement">
          <nav class="flex w-full min-w-0 flex-col p-2" [attr.aria-label]="section.label">
            <span class="text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-xl px-3 text-xs font-medium">
              {{ section.label }}
            </span>
            <ul class="flex w-full min-w-0 flex-col gap-1">
              @for (entry of section.entries; track entry.label) {
                <li class="relative">
                  <button
                    type="button"
                    class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-xl py-2 pr-3 pl-2.5 text-left text-sm whitespace-nowrap transition-colors"
                    [class.bg-sidebar-accent]="entry.active"
                    [class.text-sidebar-accent-foreground]="entry.active"
                    [class.font-medium]="entry.active"
                    [attr.aria-current]="entry.active ? 'page' : null"
                  >
                    <ng-icon [name]="entry.icon" class="shrink-0" />
                    {{ entry.label }}
                  </button>
                </li>
              }
            </ul>
          </nav>
        </z-card>
      }
    </div>
  `,
})
export class CardSidebarNavComponent {
  readonly sections: readonly NavSection[] = [
    {
      label: 'Planning',
      placement: 'xl:col-start-1 xl:row-start-1',
      entries: [
        { label: 'Documents', icon: 'lucideFileText' },
        { label: 'Budget', icon: 'lucideWallet' },
        { label: 'Reports', icon: 'lucideChartColumn' },
        { label: 'Goals', icon: 'lucideTarget' },
        { label: 'Calendar', icon: 'lucideCalendar' },
      ],
    },
    {
      label: 'Support',
      placement: 'xl:col-start-2 xl:row-start-1',
      entries: [
        { label: 'Help Center', icon: 'lucideCircleHelp' },
        { label: 'Docs', icon: 'lucideBookOpen' },
        { label: 'Contact Us', icon: 'lucideMessageCircle' },
        { label: 'Status', icon: 'lucideActivity' },
        { label: 'Community', icon: 'lucideGlobe' },
      ],
    },
    {
      label: 'Overview',
      placement: 'xl:col-start-1 xl:row-start-2',
      entries: [
        { label: 'Analytics', icon: 'lucideChartNoAxesColumn', active: true },
        { label: 'Transactions', icon: 'lucideArrowLeftRight' },
        { label: 'Investments', icon: 'lucideTrendingUp' },
        { label: 'Accounts', icon: 'lucideLandmark' },
        { label: 'Spending', icon: 'lucideChartPie' },
      ],
    },
    {
      label: 'Account',
      placement: 'xl:col-start-2 xl:row-start-2',
      entries: [
        { label: 'Profile', icon: 'lucideUser' },
        { label: 'Billing', icon: 'lucideCreditCard', active: true },
        { label: 'Notifications', icon: 'lucideBell' },
        { label: 'Security', icon: 'lucideShield' },
        { label: 'Appearance', icon: 'lucidePalette' },
      ],
    },
  ];
}
