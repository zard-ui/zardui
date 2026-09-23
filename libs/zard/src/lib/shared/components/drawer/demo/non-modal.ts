import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="outline" (click)="visible.set(true)">Non Modal</button>

    <z-drawer [(zVisible)]="visible" zPlacement="right" [zModal]="false">
      <z-drawer-header>
        <z-drawer-title>Non Modal Drawer</z-drawer-title>
        <z-drawer-description>The page behind stays scrollable and clickable.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNonModalComponent {
  readonly visible = signal(false);
}
