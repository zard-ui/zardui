import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-rail',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar class="h-full">
        <div z-sidebar-header class="font-medium">Drag the edge</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Analytics</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The rail is the 4px strip on the sidebar's edge. It shows a resize cursor and toggles the sidebar on click —
          it is tabindex="-1", so it never steals keyboard focus.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarRailComponent {}
