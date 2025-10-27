import type { ZardIcon } from '../../icon/icons';
import { Component, signal } from '@angular/core';

import { ZardSkeletonComponent } from '../../skeleton/skeleton.component';
import { ZardBreadcrumbModule } from '../../breadcrumb/breadcrumb.module';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardAvatarComponent } from '../../avatar/avatar.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardTooltipModule } from '../../tooltip/tooltip';
import { ZardMenuModule } from '../../menu/menu.module';
import { LayoutModule } from '../layout.module';

interface MenuItem {
  icon: ZardIcon;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'z-demo-layout-collapsible',
  standalone: true,
  imports: [
    LayoutModule,
    ZardButtonComponent,
    ZardBreadcrumbModule,
    ZardMenuModule,
    ZardSkeletonComponent,
    ZardTooltipModule,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
  ],
  template: `
    <!-- border and rounded-md are just for the demo purpose -->
    <z-layout class="border rounded-md overflow-hidden">
      <z-sidebar [zWidth]="250" [zCollapsible]="true" [zCollapsed]="sidebarCollapsed()" [zCollapsedWidth]="70" (zCollapsedChange)="onCollapsedChange($event)" class="!p-0">
        <nav [class]="'flex flex-col h-full overflow-hidden ' + (sidebarCollapsed() ? 'gap-1 p-1 pt-4' : 'gap-4 p-4')">
          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Main</z-sidebar-group-label>
            }
            @for (item of mainMenuItems; track item.label) {
              <button z-button zType="ghost" [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'" [zTooltip]="sidebarCollapsed() ? item.label : ''" zPosition="right">
                <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : ' mr-2'"></z-icon>
                @if (!sidebarCollapsed()) {
                  <span>{{ item.label }}</span>
                }
              </button>
            }
          </z-sidebar-group>

          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Workspace</z-sidebar-group-label>
            }
            @for (item of workspaceMenuItems; track item.label) {
              @if (item.submenu) {
                <button
                  z-button
                  zType="ghost"
                  z-menu
                  [zMenuTriggerFor]="submenu"
                  zPlacement="rightTop"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : null"
                  zPosition="right"
                >
                  <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : ' mr-2'"></z-icon>
                  @if (!sidebarCollapsed()) {
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <z-icon zType="chevron-right" />
                  }
                </button>

                <ng-template #submenu>
                  <div z-menu-content class="w-48">
                    @for (subitem of item.submenu; track subitem.label) {
                      <button z-menu-item>{{ subitem.label }}</button>
                    }
                  </div>
                </ng-template>
              } @else {
                <button
                  z-button
                  zType="ghost"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : ''"
                  zPosition="right"
                >
                  <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : ' mr-2'"></z-icon>
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </button>
              }
            }
          </z-sidebar-group>

          <div class="mt-auto">
            <div
              z-menu
              [zMenuTriggerFor]="userMenu"
              zPlacement="rightBottom"
              [class]="'flex items-center justify-center gap-2 cursor-pointer rounded-md hover:bg-accent ' + (sidebarCollapsed() ? 'p-0 m-2' : 'p-2')"
            >
              <z-avatar zSize="sm" [zImage]="avatar" />

              @if (!sidebarCollapsed()) {
                <div>
                  <span class="font-medium">zardui</span>
                  <div class="text-xs">test&#64;zardui.com</div>
                </div>

                <z-icon zType="chevrons-up-down" class="ml-auto" />
              }
            </div>

            <ng-template #userMenu>
              <div z-menu-content class="w-48">
                <button z-menu-item>
                  <z-icon zType="user" class="mr-2" />
                  Profile
                </button>
                <button z-menu-item>
                  <z-icon zType="settings" class="mr-2" />
                  Settings
                </button>
                <z-divider zSpacing="sm" />
                <button z-menu-item>
                  <z-icon zType="log-out" class="mr-2" />
                  Logout
                </button>
              </div>
            </ng-template>
          </div>
        </nav>
      </z-sidebar>

      <!-- min-h-[200px] is just for the demo purpose to have a minimum height -->
      <z-content class="min-h-[200px]">
        <div class="flex items-center">
          <button z-button zType="ghost" zSize="sm" class="-ml-2" (click)="toggleSidebar()">
            <z-icon zType="panel-left" />
          </button>

          <z-divider zOrientation="vertical" class="h-4 ml-2" />

          <z-breadcrumb>
            <z-breadcrumb-list zWrap="wrap" zAlign="start">
              <z-breadcrumb-item>
                <z-breadcrumb-link zLink="/docs/components/layout">Home</z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-link zLink="/docs/components/layout">Components</z-breadcrumb-link>
              </z-breadcrumb-item>
            </z-breadcrumb-list>
          </z-breadcrumb>
        </div>

        <div class="space-y-4 py-4">
          <z-skeleton class="h-80 w-full"></z-skeleton>
          <z-skeleton class="h-16 w-full"></z-skeleton>
        </div>
      </z-content>
    </z-layout>
  `,
})
export class LayoutDemoSidebarComponent {
  sidebarCollapsed = signal(false);

  mainMenuItems: MenuItem[] = [
    { icon: 'house', label: 'Home' },
    { icon: 'inbox', label: 'Inbox' },
  ];

  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'folder',
      label: 'Projects',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'search', label: 'Search' },
  ];

  avatar = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
