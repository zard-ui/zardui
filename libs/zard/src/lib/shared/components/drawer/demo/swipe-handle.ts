import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Placeholder block the service renders as string content. */
const BOX = '<div class="bg-muted h-80 w-full rounded-2xl"></div>';

@Component({
  selector: 'z-demo-drawer-swipe-handle',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
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
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="secondary" (click)="openDrawer()">Open Drawer</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSwipeHandleComponent {
  private readonly drawerService = inject(ZardDrawerService);

  readonly visible = signal(false);

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Drawer',
      zDescription: 'Drawer with a swipe handle.',
      zHandle: true,
      zContent: BOX,
      zOkText: null,
      zCancelText: 'Close',
    });
  }
}
