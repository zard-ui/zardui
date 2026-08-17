import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSettings } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-icon',
  imports: [ZardSidebarImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Platform</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button [zTooltip]="item.title">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">
          Collapse the sidebar and hover an icon — the label comes back as a tooltip.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCalendar, lucideHouse, lucideInbox, lucideSettings })],
})
export class ZardDemoSidebarCollapsibleIconComponent {
  readonly navItems = [
    { title: 'Home', icon: 'lucideHouse' },
    { title: 'Inbox', icon: 'lucideInbox' },
    { title: 'Calendar', icon: 'lucideCalendar' },
    { title: 'Settings', icon: 'lucideSettings' },
  ];
}
