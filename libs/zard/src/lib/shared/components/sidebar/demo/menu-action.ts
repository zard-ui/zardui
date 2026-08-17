import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-action',
  imports: [ZardSidebarImports, ZardDropdownImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Projects</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (project of projects; track project) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button>{{ project }}</button>

                    <button z-sidebar-menu-action zShowOnHover z-dropdown [zDropdownMenu]="projectMenu">
                      <ng-icon name="lucideMoreHorizontal" />
                      <span class="sr-only">More</span>
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <z-dropdown-menu-content #projectMenu="zDropdownMenuContent" class="w-40">
        <z-dropdown-menu-item (click)="lastAction.set('Rename')">Rename</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="lastAction.set('Duplicate')">Duplicate</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="lastAction.set('Delete')">Delete</z-dropdown-menu-item>
      </z-dropdown-menu-content>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          With zShowOnHover the action only appears on hover or keyboard focus. Last action:
          <span class="text-foreground font-medium">{{ lastAction() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMoreHorizontal })],
})
export class ZardDemoSidebarMenuActionComponent {
  readonly projects = ['Design Engineering', 'Sales & Marketing', 'Travel'];
  readonly lastAction = signal('none');
}
