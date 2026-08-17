import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-variant-floating',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zVariant="floating" zCollapsible="icon" class="h-full">
        <div z-sidebar-header class="font-medium">Floating</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Overview">Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Activity">Activity</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start"></button>
        <p class="text-muted-foreground text-sm">The panel is inset by 2 and gets its own border and shadow.</p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarVariantFloatingComponent {}
