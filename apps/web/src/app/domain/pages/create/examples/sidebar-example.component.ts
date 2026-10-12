import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardItemImports } from '@zard/components/item';
import { ZardSidebarImports } from '@zard/components/sidebar';

import { SIDEBAR_DOCS_NAV } from './sidebar-example.data';

const VERSIONS = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'] as const;

/** shadcn/ui's `sidebar-example`, in zard: a whole page, so no example wrapper. */
@Component({
  selector: 'z-sidebar-example',
  imports: [NgIcon, ZardDropdownImports, ZardInputComponent, ZardItemImports, ZardSidebarImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideChevronsUpDown, lucideSearch })],
  template: `
    <z-sidebar-provider zDefaultOpen="true">
      <z-sidebar>
        <z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button
                type="button"
                z-sidebar-menu-button
                zSize="lg"
                class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                z-dropdown
                [zDropdownMenu]="versionMenu"
              >
                <div z-item class="p-0" zSize="xs">
                  <div z-item-content>
                    <div z-item-title class="text-sm">Documentation</div>
                    <p z-item-description>v{{ selectedVersion() }}</p>
                  </div>
                  <div z-item-actions>
                    <ng-icon name="lucideChevronsUpDown" />
                  </div>
                </div>
              </button>
              <z-dropdown-menu-content #versionMenu="zDropdownMenuContent">
                <z-dropdown-menu-group>
                  @for (version of versions; track version) {
                    <z-dropdown-menu-item (click)="selectedVersion.set(version)">
                      v{{ version }}
                      @if (version === selectedVersion()) {
                        <ng-icon name="lucideCheck" class="ml-auto" />
                      }
                    </z-dropdown-menu-item>
                  }
                </z-dropdown-menu-group>
              </z-dropdown-menu-content>
            </li>
          </ul>
          <form>
            <z-sidebar-group class="py-0">
              <z-sidebar-group-content class="relative">
                <label for="search" class="sr-only">Search</label>
                <input z-input z-sidebar-input id="search" placeholder="Search the docs..." class="pl-8" />
                <ng-icon
                  name="lucideSearch"
                  class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
                />
              </z-sidebar-group-content>
            </z-sidebar-group>
          </form>
        </z-sidebar-header>
        <z-sidebar-content>
          @for (item of navMain; track item.title) {
            <z-sidebar-group>
              <z-sidebar-group-label>{{ item.title }}</z-sidebar-group-label>
              <z-sidebar-group-content>
                <ul z-sidebar-menu>
                  @for (subItem of item.items; track subItem.title) {
                    <li z-sidebar-menu-item>
                      <a z-sidebar-menu-button [href]="subItem.url" [zActive]="!!subItem.isActive">
                        {{ subItem.title }}
                      </a>
                    </li>
                  }
                </ul>
              </z-sidebar-group-content>
            </z-sidebar-group>
          }
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
export class SidebarExampleComponent {
  protected readonly versions = VERSIONS;
  protected readonly navMain = SIDEBAR_DOCS_NAV;
  protected readonly selectedVersion = signal<string>(VERSIONS[0]);
}
