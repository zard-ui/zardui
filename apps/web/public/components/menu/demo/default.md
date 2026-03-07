```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  zardBookOpenIcon,
  zardChevronDownIcon,
  zardChevronRightIcon,
  zardFileTextIcon,
  zardInfoIcon,
  zardUsersIcon,
} from '@/shared/core/icons-registry';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

@Component({
  selector: 'zard-demo-menu-default',
  imports: [ZardMenuImports, ZardButtonComponent, ZardDividerComponent, NgIcon],
  template: `
    <nav class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-1">
          <div class="relative">
            <button type="button" z-button zType="ghost" z-menu zTrigger="hover" [zMenuTriggerFor]="productsMenu">
              Products
              <ng-icon name="chevron-down" class="ml-1" />
            </button>

            <ng-template #productsMenu>
              <div z-menu-content class="w-48">
                <button type="button" z-menu-item (click)="log('Analytics')">Analytics</button>
                <button type="button" z-menu-item (click)="log('Dashboard')">Dashboard</button>
                <button type="button" z-menu-item (click)="log('Reports')">Reports</button>
                <button type="button" z-menu-item zDisabled (click)="log('Insights')">Insights</button>
              </div>
            </ng-template>
          </div>

          <div class="relative">
            <button type="button" z-button zType="ghost" z-menu zTrigger="hover" [zMenuTriggerFor]="solutionsMenu">
              Solutions
              <ng-icon name="chevron-down" class="ml-1" />
            </button>

            <ng-template #solutionsMenu>
              <div z-menu-content class="w-80 p-2">
                <div class="grid gap-1">
                  <button
                    type="button"
                    z-menu-item
                    (click)="log('For Startups')"
                    class="flex h-auto flex-col items-start py-3"
                  >
                    <div class="text-sm font-medium">For Startups</div>
                    <div class="text-muted-foreground mt-1 text-xs">
                      Get started quickly with our startup-friendly tools
                    </div>
                  </button>

                  <button
                    type="button"
                    z-menu-item
                    (click)="log('For Enterprise')"
                    class="flex h-auto flex-col items-start py-3"
                  >
                    <div class="text-sm font-medium">For Enterprise</div>
                    <div class="text-muted-foreground mt-1 text-xs">
                      Scale your business with enterprise-grade features
                    </div>
                  </button>

                  <button
                    type="button"
                    z-menu-item
                    (click)="log('For Agencies')"
                    class="flex h-auto flex-col items-start py-3"
                  >
                    <div class="text-sm font-medium">For Agencies</div>
                    <div class="text-muted-foreground mt-1 text-xs">Manage multiple clients with our agency tools</div>
                  </button>
                </div>
              </div>
            </ng-template>
          </div>

          <div class="relative">
            <button type="button" z-button zType="ghost" z-menu zTrigger="hover" [zMenuTriggerFor]="resourcesMenu">
              Resources
              <ng-icon name="chevron-down" />
            </button>

            <ng-template #resourcesMenu>
              <div z-menu-content class="w-56">
                <button type="button" z-menu-item (click)="log('Blog')">
                  <ng-icon name="book-open" class="mr-2" />
                  Blog
                </button>

                <button type="button" z-menu-item (click)="log('Documentation')">
                  <ng-icon name="file-text" class="mr-2" />
                  Documentation
                </button>

                <button
                  type="button"
                  z-menu-item
                  z-menu
                  [zMenuTriggerFor]="helpSubmenu"
                  zPlacement="rightTop"
                  class="justify-between"
                >
                  <div class="flex items-center">
                    <ng-icon name="info" class="mr-2" />
                    Help & Support
                  </div>
                  <ng-icon name="chevron-right" />
                </button>

                <z-divider zSpacing="sm" />

                <button type="button" z-menu-item (click)="log('Community')">
                  <ng-icon name="users" class="mr-2" />
                  Community
                </button>
              </div>
            </ng-template>

            <ng-template #helpSubmenu>
              <div z-menu-content class="w-48">
                <button type="button" z-menu-item (click)="log('Getting Started')">Getting Started</button>
                <button type="button" z-menu-item (click)="log('Tutorials')">Tutorials</button>
                <button type="button" z-menu-item (click)="log('FAQ')">FAQ</button>

                <z-divider zSpacing="sm" />

                <button type="button" z-menu-item (click)="log('Contact Support')">Contact Support</button>
                <button type="button" z-menu-item (click)="log('Live Chat')">Live Chat</button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  viewProviders: [
    provideIcons({
      chevronDown: zardChevronDownIcon,
      chevronRight: zardChevronRightIcon,
      bookOpen: zardBookOpenIcon,
      fileText: zardFileTextIcon,
      info: zardInfoIcon,
      users: zardUsersIcon,
    }),
  ],
})
export class ZardDemoMenuDefaultComponent {
  log(item: string) {
    console.log('Navigate to:', item);
  }
}

```