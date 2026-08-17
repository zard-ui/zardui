import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-keyboard-shortcut',
  imports: [ZardSidebarImports, ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <z-sidebar-provider
      #provider="zSidebarProvider"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Navigation</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Dashboard">Dashboard</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Reports">Reports</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail></button>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start"></button>

        <p class="flex flex-wrap items-center gap-2 text-sm">
          Press
          <z-kbd-group>
            <z-kbd>⌘</z-kbd>
            <span>+</span>
            <z-kbd>B</z-kbd>
          </z-kbd-group>
          on macOS or
          <z-kbd-group>
            <z-kbd>Ctrl</z-kbd>
            <span>+</span>
            <z-kbd>B</z-kbd>
          </z-kbd-group>
          elsewhere to toggle the sidebar.
        </p>

        <p class="text-muted-foreground text-sm">
          Current state:
          <span class="text-foreground font-medium">{{ provider.sidebarService.state() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarKeyboardShortcutComponent {}
