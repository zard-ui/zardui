import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

const PLACEMENTS: ZardDrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

/** Placeholder block the service renders as string content. */
const BOX = '<div class="bg-muted min-h-40 w-full rounded-2xl"></div>';

@Component({
  selector: 'z-demo-drawer-position',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
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
      </z-tab>

      <z-tab label="Service">
        <div class="flex flex-wrap gap-2">
          @for (option of placements; track option) {
            <button type="button" z-button zType="secondary" class="capitalize" (click)="openDrawer(option)">
              {{ option }}
            </button>
          }
        </div>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerPositionComponent {
  private readonly drawerService = inject(ZardDrawerService);

  readonly placements = PLACEMENTS;
  readonly visible = signal(false);
  readonly placement = signal<ZardDrawerPlacement>('bottom');

  open(placement: ZardDrawerPlacement) {
    this.placement.set(placement);
    this.visible.set(true);
  }

  openDrawer(placement: ZardDrawerPlacement) {
    this.drawerService.create({
      zTitle: 'Move Goal',
      zDescription: 'Set your daily activity goal.',
      zPlacement: placement,
      zContent: BOX,
      zOkText: null,
      zCancelText: 'Close',
    });
  }
}
