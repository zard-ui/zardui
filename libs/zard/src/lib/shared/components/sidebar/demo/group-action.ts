import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-group-action',
  imports: [ZardSidebarImports, NgIcon],
  viewProviders: [provideIcons({ lucidePlus })],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Projects</div>

            <button z-sidebar-group-action title="Add Project" (click)="addProject()">
              <ng-icon name="lucidePlus" />
              <span class="sr-only">Add Project</span>
            </button>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (project of projects(); track project) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button>{{ project }}</button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The action sits in the top-right corner of the group and hides when the sidebar collapses to icons.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarGroupActionComponent {
  readonly projects = signal(['Design Engineering', 'Sales & Marketing']);

  addProject(): void {
    this.projects.update(projects => [...projects, 'Project ' + (projects.length + 1)]);
  }
}
