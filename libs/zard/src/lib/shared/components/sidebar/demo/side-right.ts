import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-side-right',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">The inset comes first, so the sidebar docks on the right.</p>
      </main>

      <z-sidebar zSide="right" class="h-full">
        <div z-sidebar-header class="font-medium">Inspector</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Properties</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Appearance</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Layout</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Typography</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarSideRightComponent {}
