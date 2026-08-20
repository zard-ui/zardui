import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

import { injectIsMobile } from './is-mobile';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="first.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="first" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Open another drawer from the same direction.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="second.set(true)">Open Nested Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="second" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Nested Drawer</z-drawer-title>
        <z-drawer-description>The parent drawer stays mounted behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="third.set(true)">Open Third Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="third" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Third Drawer</z-drawer-title>
        <z-drawer-description>Two drawers are stacked behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNestedComponent {
  private readonly isMobileViewport = injectIsMobile();

  readonly first = signal(false);
  readonly second = signal(false);
  readonly third = signal(false);

  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));
}
