import { Component, signal } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBreadcrumbModule } from '@/shared/components/breadcrumb/breadcrumb.module';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardIconComponent, type ZardIcon } from '@/shared/components/icon';
import { LayoutImports } from '@/shared/components/layout/layout.imports';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardTooltipModule } from '@/shared/components/tooltip';

interface MenuItem {
  icon: ZardIcon;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'z-demo-layout-collapsible',
  imports: [
    LayoutImports,
    ZardButtonComponent,
    ZardBreadcrumbModule,
    ZardMenuImports,
    ZardSkeletonComponent,
    ZardTooltipModule,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardIconComponent,
  ],
  template: `
    <!-- border and rounded-md are just for the demo purpose -->
    <z-layout class="overflow-hidden rounded-md border">
      <z-sidebar
        [zWidth]="250"
        [zCollapsible]="true"
        [zCollapsed]="sidebarCollapsed()"
        [zCollapsedWidth]="70"
        (zCollapsedChange)="onCollapsedChange($event)"
        class="p-0!"
      >
        <nav [class]="'flex h-full flex-col overflow-hidden ' + (sidebarCollapsed() ? 'gap-1 p-1 pt-4' : 'gap-4 p-4')">
          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Main</z-sidebar-group-label>
            }
            @for (item of mainMenuItems; track item.label) {
              <button
                type="button"
                z-button
                zType="ghost"
                [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                [zTooltip]="sidebarCollapsed() ? item.label : ''"
                zPosition="right"
              >
                <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
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
                  type="button"
                  z-button
                  zType="ghost"
                  z-menu
                  [zMenuTriggerFor]="submenu"
                  zPlacement="rightTop"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : null"
                  zPosition="right"
                >
                  <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
                  @if (!sidebarCollapsed()) {
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <z-icon zType="chevron-right" />
                  }
                </button>

                <ng-template #submenu>
                  <div z-menu-content class="w-48">
                    @for (subitem of item.submenu; track subitem.label) {
                      <button type="button" z-menu-item>{{ subitem.label }}</button>
                    }
                  </div>
                </ng-template>
              } @else {
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : ''"
                  zPosition="right"
                >
                  <z-icon [zType]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
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
              [class]="
                'hover:bg-accent flex cursor-pointer items-center justify-center gap-2 rounded-md ' +
                (sidebarCollapsed() ? 'm-2 p-0' : 'p-2')
              "
            >
              <z-avatar zSrc="https://zardui.com/images/avatar/imgs/avatar_image.jpg" zAlt="Zard UI" />

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
                <button type="button" z-menu-item>
                  <z-icon zType="user" class="mr-2" />
                  Profile
                </button>
                <button type="button" z-menu-item>
                  <z-icon zType="settings" class="mr-2" />
                  Settings
                </button>
                <z-divider zSpacing="sm" />
                <button type="button" z-menu-item>
                  <z-icon zType="log-out" class="mr-2" />
                  Logout
                </button>
              </div>
            </ng-template>
          </div>
        </nav>
      </z-sidebar>

      <!-- min-h-[200px] is just for the demo purpose to have a minimum height -->
      <z-content class="min-h-50">
        <div class="flex items-center">
          <button type="button" z-button zType="ghost" zSize="sm" class="-ml-2" (click)="toggleSidebar()">
            <z-icon zType="panel-left" />
          </button>

          <z-divider zOrientation="vertical" class="ml-2 h-4" />

          <z-breadcrumb zWrap="wrap" zAlign="start">
            <z-breadcrumb-item [routerLink]="['/docs/components/layout']">Home</z-breadcrumb-item>
            <z-breadcrumb-item>
              <span aria-current="page">Components</span>
            </z-breadcrumb-item>
          </z-breadcrumb>
        </div>

        <div class="space-y-4 py-4">
          <z-skeleton class="h-80 w-full" />
          <z-skeleton class="h-16 w-full" />
        </div>
      </z-content>
    </z-layout>
  `,
})
export class LayoutDemoSidebarComponent {
  readonly sidebarCollapsed = signal(false);

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

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
