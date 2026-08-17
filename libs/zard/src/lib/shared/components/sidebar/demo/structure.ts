import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-structure',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-104 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none" class="border-r">
        <div z-sidebar-header class="border-b border-dashed">
          <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">SidebarHeader</span>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group class="border-b border-dashed">
            <div z-sidebar-group-label>SidebarGroup</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
              </ul>
            </div>
          </div>

          <div z-sidebar-group class="border-b border-dashed">
            <div z-sidebar-group-label>SidebarGroup</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer class="border-t border-dashed">
          <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">SidebarFooter</span>
        </div>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <div class="flex h-full items-center justify-center rounded-xl border border-dashed">
          <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">SidebarInset</span>
        </div>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarStructureComponent {}
