import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Placeholder block the service renders as string content. */
const BOX = '<div class="bg-muted min-h-40 w-full rounded-2xl"></div>';

@Component({
  selector: 'z-demo-drawer-non-modal',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
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
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDrawer()">Non Modal</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNonModalComponent {
  private readonly drawerService = inject(ZardDrawerService);

  readonly visible = signal(false);

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Non Modal Drawer',
      zDescription: 'The page behind stays scrollable and clickable.',
      zPlacement: 'right',
      zMask: false,
      zContent: BOX,
      zOkText: null,
      zCancelText: 'Close',
    });
  }
}
