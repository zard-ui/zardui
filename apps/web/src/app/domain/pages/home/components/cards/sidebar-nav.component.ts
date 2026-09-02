import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowLeftRight,
  lucideBookOpen,
  lucideCalendar,
  lucideChartColumn,
  lucideChartPie,
  lucideCircleHelp,
  lucideCreditCard,
  lucideFileText,
  lucideGlobe,
  lucideLandmark,
  lucideMessageCircle,
  lucidePalette,
  lucideBell,
  lucideShield,
  lucideTarget,
  lucideTrendingUp,
  lucideUser,
  lucideWallet,
  lucideChartNoAxesColumn,
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

/**
 * Quatro menus de navegação num quadrado 2 × 2.
 *
 * Não usa o componente de sidebar: a sidebar traz provider, colapso e contexto
 * de layout, e nada disso serve a um card que só precisa mostrar como uma lista
 * de navegação se lê. O que está sendo demonstrado é o *ritmo* — rótulo de
 * grupo, ícone, item, item ativo —, e isso é `div` e `button`.
 */
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
        <z-card [class]="'overflow-hidden rounded-3xl py-0 ' + section.placement">
          <nav class="flex flex-col gap-1 p-2" [attr.aria-label]="section.label">
            <span class="text-muted-foreground px-2 py-1.5 text-xs font-medium">{{ section.label }}</span>
            @for (entry of section.entries; track entry.label) {
              <button
                type="button"
                class="hover:bg-accent hover:text-accent-foreground flex h-8 items-center gap-2 rounded-md px-2 text-sm transition-colors"
                [class.bg-accent]="entry.active"
                [class.font-medium]="entry.active"
                [attr.aria-current]="entry.active ? 'page' : null"
              >
                <ng-icon [name]="entry.icon" class="size-4 shrink-0" />
                {{ entry.label }}
              </button>
            }
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
