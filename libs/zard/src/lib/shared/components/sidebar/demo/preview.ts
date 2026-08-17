import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronDown,
  lucideChevronsUpDown,
  lucideGalleryVerticalEnd,
  lucideHouse,
  lucideInbox,
  lucideLogOut,
  lucideSearch,
  lucideSettings,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator/separator.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

interface NavItem {
  readonly title: string;
  readonly icon: string;
}

@Component({
  selector: 'z-demo-sidebar-preview',
  imports: [
    ZardSidebarImports,
    ZardDropdownImports,
    ZardBreadcrumbImports,
    ZardSeparatorComponent,
    ZardSkeletonComponent,
    ZardAvatarComponent,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({
      lucideCalendar,
      lucideChevronDown,
      lucideChevronsUpDown,
      lucideGalleryVerticalEnd,
      lucideHouse,
      lucideInbox,
      lucideLogOut,
      lucideSearch,
      lucideSettings,
      lucideUser,
    }),
  ],
  template: `
    <z-sidebar-provider>
      <z-sidebar zCollapsible="icon">
        <div z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="workspaces">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideGalleryVerticalEnd" class="size-4" />
                </div>

                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{{ workspace() }}</span>
                  <span class="text-muted-foreground truncate text-xs">Enterprise</span>
                </div>

                <ng-icon name="lucideChevronDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content #workspaces="zDropdownMenuContent" class="w-56">
                @for (name of workspaceNames; track name) {
                  <z-dropdown-menu-item (click)="workspace.set(name)">{{ name }}</z-dropdown-menu-item>
                }
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Platform</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item>
                    <a
                      z-sidebar-menu-button
                      href="#"
                      [zActive]="item.title === active()"
                      [zTooltip]="item.title"
                      (click)="active.set(item.title)"
                    >
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="account">
                <z-avatar class="size-8 rounded-lg" zSrc="https://github.com/shadcn.png" zAlt="shadcn" zFallback="CN" />

                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">shadcn</span>
                  <span class="text-muted-foreground truncate text-xs">m&#64;example.com</span>
                </div>

                <ng-icon name="lucideChevronsUpDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content #account="zDropdownMenuContent" class="w-56">
                <z-dropdown-menu-item>
                  <ng-icon name="lucideUser" />
                  Profile
                </z-dropdown-menu-item>
                <z-dropdown-menu-item>
                  <ng-icon name="lucideSettings" />
                  Settings
                </z-dropdown-menu-item>
                <z-dropdown-menu-separator />
                <z-dropdown-menu-item>
                  <ng-icon name="lucideLogOut" />
                  Log out
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>

        <button z-sidebar-rail></button>
      </z-sidebar>

      <main z-sidebar-inset>
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <button z-sidebar-trigger class="-ml-1"></button>

          <z-separator zOrientation="vertical" class="mr-2 h-4" [zDecorative]="true" />

          <z-breadcrumb zLabel="Breadcrumb">
            <z-breadcrumb-item class="hidden md:block">
              <a z-breadcrumb-link href="#">Building Your Application</a>
            </z-breadcrumb-item>
            <z-breadcrumb-item>
              <span z-breadcrumb-page>{{ active() }}</span>
            </z-breadcrumb-item>
          </z-breadcrumb>
        </header>

        <div class="flex flex-1 flex-col gap-4 p-4">
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            @for (tile of [1, 2, 3]; track tile) {
              <z-skeleton class="bg-muted/50 aspect-video rounded-xl" />
            }
          </div>

          <z-skeleton class="bg-muted/50 min-h-[40vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarPreviewComponent {
  readonly workspaceNames = ['Acme Inc', 'Acme Corp.', 'Evil Corp.'] as const;
  readonly workspace = signal<string>(this.workspaceNames[0]);
  readonly active = signal('Home');

  readonly navItems: readonly NavItem[] = [
    { title: 'Home', icon: 'lucideHouse' },
    { title: 'Inbox', icon: 'lucideInbox' },
    { title: 'Calendar', icon: 'lucideCalendar' },
    { title: 'Search', icon: 'lucideSearch' },
    { title: 'Settings', icon: 'lucideSettings' },
  ];
}
