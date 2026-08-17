import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideGalleryVerticalEnd } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-header',
  imports: [ZardSidebarImports, ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideChevronDown, lucideGalleryVerticalEnd })],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
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
                  <span class="truncate font-medium">{{ workspace().name }}</span>
                  <span class="text-muted-foreground truncate text-xs">{{ workspace().plan }}</span>
                </div>

                <ng-icon name="lucideChevronDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content #workspaces="zDropdownMenuContent" class="w-56">
                <z-dropdown-menu-label>Workspaces</z-dropdown-menu-label>
                @for (option of workspaces_; track option.name) {
                  <z-dropdown-menu-item (click)="workspace.set(option)">{{ option.name }}</z-dropdown-menu-item>
                }
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Switching updates the label above</div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Active workspace:
          <span class="text-foreground font-medium">{{ workspace().name }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarHeaderComponent {
  readonly workspaces_ = [
    { name: 'Acme Inc', plan: 'Enterprise' },
    { name: 'Acme Corp.', plan: 'Startup' },
    { name: 'Evil Corp.', plan: 'Free' },
  ];

  readonly workspace = signal(this.workspaces_[0]);
}
