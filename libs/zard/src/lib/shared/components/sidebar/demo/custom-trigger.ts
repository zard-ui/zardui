import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';

@Component({
  selector: 'z-demo-sidebar-custom-trigger-button',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="sm" (click)="sidebar.toggleSidebar()">
      <ng-icon [name]="sidebar.open() ? 'lucideChevronsLeft' : 'lucideChevronsRight'" />
      {{ sidebar.open() ? 'Collapse' : 'Expand' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsLeft, lucideChevronsRight })],
})
export class ZardDemoSidebarCustomTriggerButtonComponent {
  protected readonly sidebar = inject(ZardSidebarService);
}

@Component({
  selector: 'z-demo-sidebar-custom-trigger',
  imports: [ZardSidebarImports, ZardDemoSidebarCustomTriggerButtonComponent],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Library">Library</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Downloads">Downloads</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col items-start gap-4 p-4">
        <z-demo-sidebar-custom-trigger-button />

        <p class="text-muted-foreground text-sm">
          Any button can be a trigger — call toggleSidebar() on the injected service.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCustomTriggerComponent {}
