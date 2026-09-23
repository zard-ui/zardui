import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-skeleton',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Loading projects</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (row of rows; track row) {
                  <li z-sidebar-menu-item>
                    <z-sidebar-menu-skeleton zShowIcon />
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Each row picks its own width. Unlike shadcn, the width is derived from the element id rather than
          Math.random(), so the server and the client agree during hydration.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarMenuSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
