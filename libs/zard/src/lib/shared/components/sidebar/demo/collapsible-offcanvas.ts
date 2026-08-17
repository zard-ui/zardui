import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-offcanvas',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="offcanvas" class="h-full">
        <div z-sidebar-header class="font-medium">Offcanvas</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Documents</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Shared with me</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Trash</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail></button>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start"></button>
        <p class="text-muted-foreground text-sm">
          The default. The whole panel slides out of view, and the rail stays behind as a thin handle to bring it back.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCollapsibleOffcanvasComponent {}
