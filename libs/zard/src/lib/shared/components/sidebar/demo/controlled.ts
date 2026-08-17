import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-sidebar-controlled',
  imports: [ZardSidebarImports, ZardSwitchComponent],
  template: `
    <div class="flex w-full flex-col gap-4">
      <label class="flex items-center gap-2 text-sm">
        <z-switch [zChecked]="open()" (zCheckedChange)="open.set($event)" zId="sidebar-open" />
        Sidebar open
      </label>

      <z-sidebar-provider
        class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
        [zOpen]="open()"
        (zOpenChange)="open.set($event)"
      >
        <z-sidebar zCollapsible="icon" class="h-full">
          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-content>
                <ul z-sidebar-menu>
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button zTooltip="Dashboard">Dashboard</button>
                  </li>
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button zTooltip="Team">Team</button>
                  </li>
                </ul>
              </div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="flex flex-col gap-4 p-4">
          <button z-sidebar-trigger class="self-start"></button>
          <p class="text-muted-foreground text-sm">
            The host owns the state: the trigger only reports through zOpenChange, and the switch stays in sync.
          </p>
        </main>
      </z-sidebar-provider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarControlledComponent {
  readonly open = signal(true);
}
