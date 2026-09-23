import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerRef } from '@/shared/components/drawer/drawer-ref';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { injectDrawerData, ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

import { injectIsMobile } from './support/is-mobile';

interface NestedDrawerData {
  level: number;
  placement: ZardDrawerPlacement;
  handle: boolean;
}

const LEVELS = [
  { title: 'Drawer', description: 'Open another drawer from the same direction.' },
  { title: 'Nested Drawer', description: 'The parent drawer stays mounted behind this one.' },
  { title: 'Third Drawer', description: 'Two drawers are stacked behind this one.' },
];

/** Content the service renders; the last level closes itself, the others open the next one. */
@Component({
  selector: 'z-demo-drawer-nested-content',
  imports: [ZardButtonComponent],
  template: `
    <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
    <div class="flex flex-col gap-2">
      @if (data.level < levels.length) {
        <button type="button" z-button zType="outline" (click)="openNext()">Open Nested Drawer</button>
      } @else {
        <button type="button" z-button (click)="drawerRef.close()">Close</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNestedContentComponent {
  private readonly drawerService = inject(ZardDrawerService);
  protected readonly drawerRef = inject(ZardDrawerRef);
  protected readonly data = injectDrawerData<NestedDrawerData>();
  protected readonly levels = LEVELS;

  openNext() {
    openNestedDrawer(this.drawerService, { ...this.data, level: this.data.level + 1 });
  }
}

function openNestedDrawer(drawerService: ZardDrawerService, data: NestedDrawerData) {
  const { title, description } = LEVELS[data.level - 1];

  drawerService.create({
    zTitle: title,
    zDescription: description,
    zContent: ZardDemoDrawerNestedContentComponent,
    zData: data,
    zPlacement: data.placement,
    zHandle: data.handle,
    zHideFooter: true,
  });
}

@Component({
  selector: 'z-demo-drawer-nested',
  imports: [ZardButtonComponent, ZardDrawerImports, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
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
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="secondary" (click)="openDrawer()">Open Drawer</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNestedComponent {
  private readonly drawerService = inject(ZardDrawerService);
  private readonly isMobileViewport = injectIsMobile();

  readonly first = signal(false);
  readonly second = signal(false);
  readonly third = signal(false);

  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));

  openDrawer() {
    openNestedDrawer(this.drawerService, { level: 1, placement: this.placement(), handle: this.isMobile() });
  }
}
