import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-group-collapsible',
  imports: [ZardSidebarImports, ZardCollapsibleImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-80 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          @for (group of groups; track group.label) {
            <z-collapsible class="group/collapsible" [zOpen]="group.defaultOpen">
              <div z-sidebar-group>
                <button z-collapsible-trigger z-sidebar-group-label class="w-full">
                  {{ group.label }}
                  <ng-icon
                    name="lucideChevronDown"
                    class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                  />
                </button>

                <z-collapsible-content>
                  <div z-sidebar-group-content>
                    <ul z-sidebar-menu>
                      @for (item of group.items; track item) {
                        <li z-sidebar-menu-item>
                          <button z-sidebar-menu-button>{{ item }}</button>
                        </li>
                      }
                    </ul>
                  </div>
                </z-collapsible-content>
              </div>
            </z-collapsible>
          }
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          A z-sidebar-group wrapped in z-collapsible, using the group label as the trigger.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoSidebarGroupCollapsibleComponent {
  readonly groups = [
    { label: 'Getting Started', defaultOpen: true, items: ['Installation', 'Project Structure'] },
    { label: 'Building Your Application', defaultOpen: false, items: ['Routing', 'Data Fetching', 'Rendering'] },
    { label: 'API Reference', defaultOpen: false, items: ['Components', 'File Conventions'] },
  ];
}
