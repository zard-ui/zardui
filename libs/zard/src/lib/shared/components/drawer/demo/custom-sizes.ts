import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Placeholder block the service renders as string content. */
const TALL_BOX = '<div class="bg-muted h-96 w-full rounded-2xl"></div>';
const FILL_BOX = '<div class="bg-muted min-h-40 w-full rounded-2xl"></div>';

@Component({
  selector: 'z-demo-drawer-custom-sizes',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <div class="flex flex-wrap gap-2">
          <button type="button" z-button zType="secondary" (click)="halfHeight.set(true)">Half height</button>
          <button type="button" z-button zType="secondary" (click)="wideSide.set(true)">Wide side</button>
        </div>

        <z-drawer [(zVisible)]="halfHeight" class="h-[50vh]">
          <z-drawer-header>
            <z-drawer-title>Half height</z-drawer-title>
            <z-drawer-description>The drawer keeps the height you give it.</z-drawer-description>
          </z-drawer-header>
          <div class="flex-1 overflow-y-auto p-4">
            <div class="bg-muted h-96 w-full rounded-2xl"></div>
          </div>
        </z-drawer>

        <z-drawer [(zVisible)]="wideSide" zPlacement="right" class="sm:w-lg">
          <z-drawer-header>
            <z-drawer-title>Wide side</z-drawer-title>
            <z-drawer-description>A side drawer is 24rem wide until you widen it.</z-drawer-description>
          </z-drawer-header>
          <div class="flex-1 p-4">
            <div class="bg-muted size-full rounded-2xl"></div>
          </div>
        </z-drawer>
      </z-tab>

      <z-tab label="Service">
        <div class="flex flex-wrap gap-2">
          <button type="button" z-button zType="secondary" (click)="openHalfHeight()">Half height</button>
          <button type="button" z-button zType="secondary" (click)="openWideSide()">Wide side</button>
        </div>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerCustomSizesComponent {
  private readonly drawerService = inject(ZardDrawerService);

  readonly halfHeight = signal(false);
  readonly wideSide = signal(false);

  openHalfHeight() {
    this.drawerService.create({
      zTitle: 'Half height',
      zDescription: 'The drawer keeps the height you give it.',
      zCustomClasses: 'h-[50vh]',
      zContent: TALL_BOX,
      zHideFooter: true,
    });
  }

  openWideSide() {
    this.drawerService.create({
      zTitle: 'Wide side',
      zDescription: 'A side drawer is 24rem wide until you widen it.',
      zPlacement: 'right',
      zCustomClasses: 'sm:w-lg',
      zContent: FILL_BOX,
      zHideFooter: true,
    });
  }
}
