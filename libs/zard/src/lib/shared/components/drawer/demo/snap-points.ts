import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import type { ZardDrawerSnapPoint } from '@/shared/components/drawer/drawer.utils';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const SNAP_POINTS: ZardDrawerSnapPoint[] = ['31rem', 1];

/** Placeholder block the service renders as string content. */
const BOX = '<div class="bg-muted h-80 w-full rounded-2xl"></div>';

@Component({
  selector: 'z-demo-drawer-snap-points',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open Snap Drawer</button>

        <z-drawer [(zVisible)]="visible" [zSnapPoints]="snapPoints" [(zSnapPoint)]="snapPoint" zHandle>
          <z-drawer-header>
            <z-drawer-title>Snap points</z-drawer-title>
            <z-drawer-description>
              Drag the drawer to snap between a compact peek and a near full-height view.
            </z-drawer-description>
          </z-drawer-header>
          <div class="flex-1 touch-pan-y overflow-y-auto p-4">
            <div class="bg-muted h-80 w-full rounded-2xl"></div>
          </div>
          <z-drawer-footer>
            <button type="button" z-button z-drawer-close>Close</button>
          </z-drawer-footer>
        </z-drawer>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDrawer()">Open Snap Drawer</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSnapPointsComponent {
  private readonly drawerService = inject(ZardDrawerService);

  readonly snapPoints = SNAP_POINTS;
  readonly visible = signal(false);
  readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>('31rem');

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Snap points',
      zDescription: 'Drag the drawer to snap between a compact peek and a near full-height view.',
      zSnapPoints: SNAP_POINTS,
      zSnapPoint: '31rem',
      zHandle: true,
      zContent: BOX,
      zOkText: null,
      zCancelText: 'Close',
    });
  }
}
