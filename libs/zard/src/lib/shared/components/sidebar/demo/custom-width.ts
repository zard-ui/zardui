import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-custom-width',
  imports: [ZardSidebarImports],
  template: `
    <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <z-sidebar-provider class="relative h-64 min-h-0 transform-gpu overflow-hidden rounded-xl border">
        <z-sidebar zCollapsible="none">
          <div z-sidebar-header class="font-medium">Default</div>

          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-label>16rem wide</div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="p-4 text-sm">Uses the default --sidebar-width</main>
      </z-sidebar-provider>

      <z-sidebar-provider
        class="relative h-64 min-h-0 transform-gpu overflow-hidden rounded-xl border"
        style="--sidebar-width: 20rem; --sidebar-width-icon: 4rem"
      >
        <z-sidebar zCollapsible="none">
          <div z-sidebar-header class="font-medium">Wider</div>

          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-label>20rem wide</div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="p-4 text-sm">Overrides it inline, without touching the constants</main>
      </z-sidebar-provider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCustomWidthComponent {}
