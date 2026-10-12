import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideBot,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideFrame,
  lucideMap,
  lucidePieChart,
  lucideSettings2,
  lucideSquareTerminal,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCollapsibleImports } from '@zard/components/collapsible';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardItemImports } from '@zard/components/item';
import { ZardSidebarImports } from '@zard/components/sidebar';

const USER = { name: 'shadcn', email: 'm@example.com', avatar: '/avatars/shadcn.jpg' } as const;

const TEAMS = [
  { name: 'Acme Inc', plan: 'Enterprise' },
  { name: 'Acme Corp.', plan: 'Startup' },
  { name: 'Evil Corp.', plan: 'Free' },
] as const;

type Team = (typeof TEAMS)[number];

const NAV_MAIN = [
  {
    title: 'Playground',
    url: '#',
    icon: 'lucideSquareTerminal',
    isActive: true,
    items: [
      { title: 'History', url: '#' },
      { title: 'Starred', url: '#' },
      { title: 'Settings', url: '#' },
    ],
  },
  {
    title: 'Models',
    url: '#',
    icon: 'lucideBot',
    isActive: false,
    items: [
      { title: 'Genesis', url: '#' },
      { title: 'Explorer', url: '#' },
      { title: 'Quantum', url: '#' },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: 'lucideBookOpen',
    isActive: false,
    items: [
      { title: 'Introduction', url: '#' },
      { title: 'Get Started', url: '#' },
      { title: 'Tutorials', url: '#' },
      { title: 'Changelog', url: '#' },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'lucideSettings2',
    isActive: false,
    items: [
      { title: 'General', url: '#' },
      { title: 'Team', url: '#' },
      { title: 'Billing', url: '#' },
      { title: 'Limits', url: '#' },
    ],
  },
] as const;

const PROJECTS = [
  { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
  { name: 'Sales & Marketing', url: '#', icon: 'lucidePieChart' },
  { name: 'Travel', url: '#', icon: 'lucideMap' },
] as const;

/** shadcn/ui's `sidebar-icon-example`, in zard: a whole page, so no example wrapper. */
@Component({
  selector: 'z-sidebar-icon-example',
  imports: [
    NgIcon,
    ZardAvatarComponent,
    ZardButtonComponent,
    ZardCollapsibleImports,
    ZardDropdownImports,
    ZardItemImports,
    ZardSidebarImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBookOpen,
      lucideBot,
      lucideChevronRight,
      lucideChevronsUpDown,
      lucideFrame,
      lucideMap,
      lucidePieChart,
      lucideSettings2,
      lucideSquareTerminal,
    }),
  ],
  template: `
    <z-sidebar-provider zDefaultOpen="true">
      <z-sidebar zCollapsible="icon">
        <z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button
                type="button"
                z-sidebar-menu-button
                zSize="lg"
                class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                z-dropdown
                [zDropdownMenu]="teamMenu"
              >
                <z-button zSize="icon-sm" class="size-8">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <line
                      x1="208"
                      y1="128"
                      x2="128"
                      y2="208"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                    ></line>
                    <line
                      x1="192"
                      y1="40"
                      x2="40"
                      y2="192"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                    ></line>
                  </svg>
                </z-button>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ activeTeam().name }}</span>
                  <span class="truncate text-xs">{{ activeTeam().plan }}</span>
                </div>
                <ng-icon name="lucideChevronsUpDown" />
              </button>
              <z-dropdown-menu-content #teamMenu="zDropdownMenuContent">
                <z-dropdown-menu-group>
                  <z-dropdown-menu-label>Teams</z-dropdown-menu-label>
                  @for (team of teams; track team.name) {
                    <z-dropdown-menu-item (click)="activeTeam.set(team)">{{ team.name }}</z-dropdown-menu-item>
                  }
                </z-dropdown-menu-group>
              </z-dropdown-menu-content>
            </li>
          </ul>
        </z-sidebar-header>
        <z-sidebar-content>
          <z-sidebar-group>
            <z-sidebar-group-label>Platform</z-sidebar-group-label>
            <ul z-sidebar-menu>
              @for (item of navMain; track item.title) {
                <li z-sidebar-menu-item z-collapsible class="group/collapsible" [zOpen]="item.isActive">
                  <button type="button" z-sidebar-menu-button z-collapsible-trigger [zTooltip]="item.title">
                    <ng-icon [name]="item.icon" />
                    <span>{{ item.title }}</span>
                    <ng-icon
                      name="lucideChevronRight"
                      class="ml-auto transition-transform duration-100 group-data-open/collapsible:rotate-90"
                    />
                  </button>
                  <z-collapsible-content>
                    <ul z-sidebar-menu-sub>
                      @for (subItem of item.items; track subItem.title) {
                        <li z-sidebar-menu-sub-item>
                          <a z-sidebar-menu-sub-button [href]="subItem.url">{{ subItem.title }}</a>
                        </li>
                      }
                    </ul>
                  </z-collapsible-content>
                </li>
              }
            </ul>
          </z-sidebar-group>
          <z-sidebar-group class="group-data-[collapsible=icon]:hidden">
            <z-sidebar-group-label>Projects</z-sidebar-group-label>
            <ul z-sidebar-menu>
              @for (item of projects; track item.name) {
                <li z-sidebar-menu-item>
                  <a z-sidebar-menu-button [href]="item.url">
                    <ng-icon [name]="item.icon" />
                    {{ item.name }}
                  </a>
                </li>
              }
            </ul>
          </z-sidebar-group>
        </z-sidebar-content>
        <z-sidebar-footer>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button
                type="button"
                z-sidebar-menu-button
                zSize="lg"
                class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                z-dropdown
                [zDropdownMenu]="userMenu"
              >
                <z-avatar [zSrc]="user.avatar" [zAlt]="user.name" zFallback="CN" />
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ user.name }}</span>
                  <span class="truncate text-xs">{{ user.email }}</span>
                </div>
                <ng-icon name="lucideChevronsUpDown" />
              </button>
              <z-dropdown-menu-content #userMenu="zDropdownMenuContent">
                <z-dropdown-menu-group>
                  <z-dropdown-menu-label>
                    <div z-item zSize="xs">
                      <div z-item-media>
                        <z-avatar [zSrc]="user.avatar" [zAlt]="user.name" zFallback="CN" />
                      </div>
                      <div z-item-content>
                        <div z-item-title>{{ user.name }}</div>
                        <p z-item-description>{{ user.email }}</p>
                      </div>
                    </div>
                  </z-dropdown-menu-label>
                </z-dropdown-menu-group>
                <z-dropdown-menu-separator />
                <z-dropdown-menu-group>
                  <z-dropdown-menu-item>Account</z-dropdown-menu-item>
                  <z-dropdown-menu-item>Billing</z-dropdown-menu-item>
                  <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
                </z-dropdown-menu-group>
                <z-dropdown-menu-separator />
                <z-dropdown-menu-group>
                  <z-dropdown-menu-item>Log out</z-dropdown-menu-item>
                </z-dropdown-menu-group>
              </z-dropdown-menu-content>
            </li>
          </ul>
        </z-sidebar-footer>
        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>
      <z-sidebar-inset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <button z-sidebar-trigger class="-ml-1" aria-label="Toggle Sidebar"></button>
          </div>
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
export class SidebarIconExampleComponent {
  protected readonly user = USER;
  protected readonly teams = TEAMS;
  protected readonly navMain = NAV_MAIN;
  protected readonly projects = PROJECTS;
  protected readonly activeTeam = signal<Team>(TEAMS[0]);
}
