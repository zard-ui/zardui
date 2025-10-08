```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ZardBreadcrumbModule } from '../../breadcrumb/breadcrumb.module';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../../menu/menu.module';
import { ZardSkeletonComponent } from '../../skeleton/skeleton.component';
import { ZardTooltipModule } from '../../tooltip/tooltip';
import { LayoutModule } from '../layout.module';

interface MenuItem {
  icon: string;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'z-demo-layout-collapsible',
  standalone: true,
  imports: [LayoutModule, ZardButtonComponent, ZardBreadcrumbModule, ZardMenuModule, ZardSkeletonComponent, ZardTooltipModule, ZardDividerComponent],
  template: `
    <z-layout class="min-h-[500px] border rounded-md overflow-hidden">
      <z-sidebar [zWidth]="250" [zCollapsible]="true" [zCollapsed]="sidebarCollapsed()" [zCollapsedWidth]="70" (zCollapsedChange)="onCollapsedChange($event)" class="!p-0">
        <nav [class]="'flex flex-col p-4 overflow-hidden ' + (sidebarCollapsed() ? 'gap-1' : 'gap-4')">
          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Main</z-sidebar-group-label>
            }
            @for (item of mainMenuItems; track item.label) {
              <button z-button zType="ghost" [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'" [zTooltip]="sidebarCollapsed() ? item.label : ''" zPosition="right">
                <i [class]="sidebarCollapsed() ? item.icon : item.icon + ' mr-2'"></i>
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
                  <i [class]="sidebarCollapsed() ? item.icon : item.icon + ' mr-2'"></i>
                  @if (!sidebarCollapsed()) {
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <i class="icon-chevron-right"></i>
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
                  <i [class]="sidebarCollapsed() ? item.icon : item.icon + ' mr-2'"></i>
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </button>
              }
            }
          </z-sidebar-group>
        </nav>
      </z-sidebar>

      <z-content>
        <div class="flex items-center">
          <button z-button zType="ghost" zSize="sm" class="-ml-2" (click)="toggleSidebar()">
            <i class="icon-panel-left"></i>
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
          <z-skeleton class="h-60 w-full"></z-skeleton>
          <z-skeleton class="h-16 w-full"></z-skeleton>
        </div>
      </z-content>
    </z-layout>
  `,
})
export class LayoutDemoCollapsibleComponent {
  sidebarCollapsed = signal(false);

  mainMenuItems: MenuItem[] = [
    { icon: 'icon-house', label: 'Home' },
    { icon: 'icon-inbox', label: 'Inbox' },
  ];

  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'icon-folder',
      label: 'Projects',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'icon-calendar', label: 'Calendar' },
    { icon: 'icon-search', label: 'Search' },
  ];

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}

```