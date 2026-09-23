import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-none',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none" class="border-r">
        <div z-sidebar-header class="font-medium">Always open</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zActive>General</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Billing</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Notifications</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          No trigger, no rail, no gap — the sidebar is a plain column that never collapses.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCollapsibleNoneComponent {}
