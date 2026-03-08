import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { LayoutImports } from '@/shared/components/layout/layout.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardIconRegistry } from '@/shared/core/icons-registry';

@Component({
  selector: 'z-demo-layout-full',
  imports: [LayoutImports, ZardButtonComponent, ZardSkeletonComponent, NgOptimizedImage, NgIcon],
  template: `
    <z-layout class="min-h-150 overflow-hidden rounded-md border">
      <z-header>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center text-lg font-semibold">
            <img ngSrc="images/zard.svg" class="dark:invert" alt="Logo" width="24" height="24" />
            <span class="ml-2">ZardUI</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" z-button zType="ghost" zSize="sm">
              <ng-icon name="search" />
            </button>
            <button type="button" z-button zType="ghost" zSize="sm">
              <ng-icon name="bell" />
            </button>
          </div>
        </div>
      </z-header>

      <z-layout>
        <z-sidebar [zWidth]="200" class="p-0!">
          <nav class="flex h-full flex-col gap-2 p-4">
            <z-sidebar-group>
              <z-sidebar-group-label>Menu</z-sidebar-group-label>
              <button type="button" z-button zType="secondary" class="justify-start">
                <ng-icon name="house" class="mr-2" />
                Dashboard
              </button>
              <button type="button" z-button zType="ghost" class="justify-start">
                <ng-icon name="layers" class="mr-2" />
                Projects
              </button>
              <button type="button" z-button zType="ghost" class="justify-start">
                <ng-icon name="users" class="mr-2" />
                Team
              </button>
            </z-sidebar-group>
          </nav>
        </z-sidebar>

        <z-layout>
          <z-content class="min-h-50">
            <div class="space-y-4">
              <z-skeleton class="h-32 w-full" />
              <z-skeleton class="h-48 w-full" />
              <z-skeleton class="h-24 w-full" />
            </div>
          </z-content>

          <z-footer>
            <div class="text-muted-foreground flex w-full items-center justify-center text-sm">© {{ year }} ZardUI</div>
          </z-footer>
        </z-layout>
      </z-layout>
    </z-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      search: ZardIconRegistry.search,
      bell: ZardIconRegistry.bell,
      house: ZardIconRegistry.house,
      layers: ZardIconRegistry.layers,
      users: ZardIconRegistry.users,
    }),
  ],
})
export class LayoutDemoFullComponent {
  year = new Date().getFullYear();
}
