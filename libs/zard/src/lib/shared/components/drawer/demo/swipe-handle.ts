import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="visible" zHandle>
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Drawer with a swipe handle.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted h-80 w-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSwipeHandleComponent {
  readonly visible = signal(false);
}
