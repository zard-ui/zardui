import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of placements; track option) {
        <button type="button" z-button zType="secondary" class="capitalize" (click)="open(option)">
          {{ option }}
        </button>
      }
    </div>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()">
      <z-drawer-header>
        <z-drawer-title>Move Goal</z-drawer-title>
        <z-drawer-description>Set your daily activity goal.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-40 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerPositionComponent {
  readonly placements: ZardDrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

  readonly visible = signal(false);
  readonly placement = signal<ZardDrawerPlacement>('bottom');

  open(placement: ZardDrawerPlacement) {
    this.placement.set(placement);
    this.visible.set(true);
  }
}
