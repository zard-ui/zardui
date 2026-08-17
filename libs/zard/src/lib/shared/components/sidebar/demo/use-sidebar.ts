import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';

/**
 * Any component rendered inside z-sidebar-provider can inject the service — this is the Angular
 * counterpart of shadcn's useSidebar() hook.
 */
@Component({
  selector: 'z-demo-sidebar-debug-panel',
  imports: [ZardButtonComponent, ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-start gap-3">
      <button z-button zType="outline" zSize="sm" (click)="sidebar.toggleSidebar()">toggleSidebar()</button>

      <dl class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
        <dt class="text-muted-foreground">state</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.state() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">open</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.open() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">isMobile</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.isMobile() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">openMobile</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.openMobile() }}</z-badge>
        </dd>
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarDebugPanelComponent {
  protected readonly sidebar = inject(ZardSidebarService);
}

@Component({
  selector: 'z-demo-sidebar-use-sidebar',
  imports: [ZardSidebarImports, ZardDemoSidebarDebugPanelComponent],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Overview">Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Insights">Insights</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <z-demo-sidebar-debug-panel />
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarUseSidebarComponent {}
