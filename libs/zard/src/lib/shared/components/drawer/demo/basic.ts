import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

import { injectIsMobile } from './is-mobile';

const DELIVERY_TIMES = [
  {
    value: 'asap',
    id: 'delivery-asap',
    label: 'Standard delivery',
    description: '25–35 min · Driver assigned now',
    badge: 'Fastest',
  },
  { value: '5-00', id: 'delivery-5-00', label: '5:00 PM – 5:15 PM', description: 'Prep starts at 4:45 PM' },
  { value: '5-30', id: 'delivery-5-30', label: '5:30 PM – 5:45 PM', description: `Good if you're heading home` },
  { value: '6-00', id: 'delivery-6-00', label: '6:00 PM – 6:15 PM', description: 'Most popular · High demand' },
  { value: '6-30', id: 'delivery-6-30', label: '6:30 PM – 6:45 PM', description: 'Last slot before kitchen closes' },
];

@Component({
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardDrawerImports, ...ZardRadioGroupImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Pick a delivery time</z-drawer-title>
        <z-drawer-description>We'll prepare your order as soon as possible.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 overflow-y-auto p-4">
        <z-radio-group [(value)]="deliveryTime" class="grid w-full gap-2">
          @for (time of times; track time.value) {
            <label
              [for]="time.id"
              class="has-data-[state=checked]:bg-input/30 flex w-full items-center gap-3 rounded-2xl border p-4 select-none"
            >
              <span class="flex flex-1 flex-col gap-1 leading-snug">
                <span class="flex items-center gap-2 text-sm font-medium">
                  {{ time.label }}
                  @if (time.badge) {
                    <z-badge zType="secondary">{{ time.badge }}</z-badge>
                  }
                </span>
                <span class="text-muted-foreground text-sm">{{ time.description }}</span>
              </span>

              <z-radio [zId]="time.id" [value]="time.value" />
            </label>
          }
        </z-radio-group>
      </div>

      <z-drawer-footer>
        <button type="button" z-button (click)="visible.set(false)">Confirm Delivery Time</button>
        <button type="button" z-button zType="ghost" z-drawer-close>Cancel</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerBasicComponent {
  private readonly isMobileViewport = injectIsMobile();

  readonly times = DELIVERY_TIMES;
  readonly visible = signal(false);
  readonly deliveryTime = signal<unknown>('asap');

  /** Bottom sheet where the screen is narrow, side panel where there is room. */
  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));
}
