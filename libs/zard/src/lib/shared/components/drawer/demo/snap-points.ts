import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerSnapPoint } from '@/shared/components/drawer/drawer.utils';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSnapPointsComponent {
  readonly snapPoints: ZardDrawerSnapPoint[] = ['31rem', 1];

  readonly visible = signal(false);
  readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>('31rem');
}
