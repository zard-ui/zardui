import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-sub',
  imports: [ZardSidebarImports, ZardCollapsibleImports, NgIcon],
  viewProviders: [provideIcons({ lucideChevronRight })],
  template: `
    <z-sidebar-provider class="relative h-80 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Platform</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item z-collapsible class="group/collapsible" [zOpen]="item.defaultOpen">
                    <button z-collapsible-trigger z-sidebar-menu-button>
                      <span>{{ item.title }}</span>
                      <ng-icon
                        name="lucideChevronRight"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                      />
                    </button>

                    <z-collapsible-content>
                      <ul z-sidebar-menu-sub>
                        @for (child of item.items; track child) {
                          <li z-sidebar-menu-sub-item>
                            <a z-sidebar-menu-sub-button href="#">{{ child }}</a>
                          </li>
                        }
                      </ul>
                    </z-collapsible-content>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          li[z-sidebar-menu-item] doubles as the collapsible root — the idiomatic translation of shadcn's asChild.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarMenuSubComponent {
  readonly navItems = [
    { title: 'Playground', defaultOpen: true, items: ['History', 'Starred', 'Settings'] },
    { title: 'Models', defaultOpen: false, items: ['Genesis', 'Explorer', 'Quantum'] },
    { title: 'Documentation', defaultOpen: false, items: ['Introduction', 'Get Started'] },
  ];
}
