import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChartLine,
  lucideChevronRight,
  lucideFile,
  lucideHouse,
  lucideLifeBuoy,
  lucideSend,
  lucideSettings2,
  lucideShoppingBag,
  lucideShoppingCart,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible';
import { ZardSidebarImports } from '@zard/components/sidebar';

interface NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly isActive?: boolean;
  readonly items?: readonly { readonly title: string; readonly url: string }[];
}

const NAV_MAIN: readonly NavItem[] = [
  {
    title: 'Dashboard',
    url: '#',
    icon: 'lucideHouse',
    isActive: true,
    items: [
      { title: 'Overview', url: '#' },
      { title: 'Analytics', url: '#' },
    ],
  },
  {
    title: 'Analytics',
    url: '#',
    icon: 'lucideChartLine',
    items: [
      { title: 'Reports', url: '#' },
      { title: 'Metrics', url: '#' },
    ],
  },
  {
    title: 'Orders',
    url: '#',
    icon: 'lucideShoppingBag',
    items: [
      { title: 'All Orders', url: '#' },
      { title: 'Pending', url: '#' },
      { title: 'Completed', url: '#' },
    ],
  },
  {
    title: 'Products',
    url: '#',
    icon: 'lucideShoppingCart',
    items: [
      { title: 'All Products', url: '#' },
      { title: 'Categories', url: '#' },
    ],
  },
  { title: 'Invoices', url: '#', icon: 'lucideFile' },
  { title: 'Customers', url: '#', icon: 'lucideUser' },
  { title: 'Settings', url: '#', icon: 'lucideSettings2' },
];

const NAV_SECONDARY: readonly NavItem[] = [
  { title: 'Support', url: '#', icon: 'lucideLifeBuoy' },
  { title: 'Feedback', url: '#', icon: 'lucideSend' },
];

/** shadcn/ui's `sidebar-inset-example`, in zard: a whole page, so no example wrapper. */
@Component({
  selector: 'z-sidebar-inset-example',
  imports: [NgIcon, ZardCollapsibleImports, ZardSidebarImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideChartLine,
      lucideChevronRight,
      lucideFile,
      lucideHouse,
      lucideLifeBuoy,
      lucideSend,
      lucideSettings2,
      lucideShoppingBag,
      lucideShoppingCart,
      lucideUser,
    }),
  ],
  template: `
    <z-sidebar-provider zDefaultOpen="true">
      <z-sidebar zVariant="inset">
        <z-sidebar-content>
          <z-sidebar-group>
            <z-sidebar-group-label>Dashboard</z-sidebar-group-label>
            <ul z-sidebar-menu>
              @for (item of navMain; track item.title) {
                <li z-sidebar-menu-item z-collapsible [zOpen]="!!item.isActive">
                  <a z-sidebar-menu-button [href]="item.url" [zTooltip]="item.title" [zActive]="!!item.isActive">
                    <ng-icon [name]="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                  @if (item.items?.length) {
                    <button
                      type="button"
                      z-sidebar-menu-action
                      z-collapsible-trigger
                      class="data-[state=open]:rotate-90"
                    >
                      <ng-icon name="lucideChevronRight" />
                      <span class="sr-only">Toggle</span>
                    </button>
                    <z-collapsible-content>
                      <ul z-sidebar-menu-sub>
                        @for (subItem of item.items; track subItem.title) {
                          <li z-sidebar-menu-sub-item>
                            <a z-sidebar-menu-sub-button [href]="subItem.url">
                              <span>{{ subItem.title }}</span>
                            </a>
                          </li>
                        }
                      </ul>
                    </z-collapsible-content>
                  }
                </li>
              }
            </ul>
          </z-sidebar-group>
          <z-sidebar-group class="mt-auto">
            <z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navSecondary; track item.title) {
                  <li z-sidebar-menu-item>
                    <a z-sidebar-menu-button zSize="sm" [href]="item.url">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </a>
                  </li>
                }
              </ul>
            </z-sidebar-group-content>
          </z-sidebar-group>
        </z-sidebar-content>
        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>
      <z-sidebar-inset>
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <button z-sidebar-trigger class="-ml-1" aria-label="Toggle Sidebar"></button>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4">
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
          </div>
          <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
        </div>
      </z-sidebar-inset>
    </z-sidebar-provider>
  `,
})
export class SidebarInsetExampleComponent {
  protected readonly navMain = NAV_MAIN;
  protected readonly navSecondary = NAV_SECONDARY;
}
