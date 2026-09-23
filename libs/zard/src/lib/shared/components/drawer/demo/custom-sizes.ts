import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerCustomSizesComponent {
  readonly halfHeight = signal(false);
  readonly wideSide = signal(false);
}
