import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Region {
  name: string;
  lng: number;
  lat: number;
  visitors: number;
}

const REGIONS: Region[] = [
  { name: 'United States', lng: -98.5, lat: 39.8, visitors: 48200 },
  { name: 'India', lng: 78.9, lat: 21.1, visitors: 26100 },
  { name: 'United Kingdom', lng: -1.9, lat: 52.9, visitors: 21300 },
  { name: 'Brazil', lng: -51.9, lat: -14.2, visitors: 18400 },
  { name: 'Germany', lng: 10.4, lat: 51.1, visitors: 17900 },
  { name: 'Japan', lng: 138.2, lat: 36.2, visitors: 15200 },
  { name: 'Australia', lng: 134.5, lat: -25.7, visitors: 9600 },
  { name: 'South Africa', lng: 24.7, lat: -29, visitors: 5100 },
  { name: 'Nigeria', lng: 8.7, lat: 9.1, visitors: 4300 },
];

const TOTAL = REGIONS.reduce((sum, region) => sum + region.visitors, 0);
const MAX = Math.max(...REGIONS.map(region => region.visitors));

@Component({
  selector: 'z-demo-map-block-analytics-map',
  imports: [
    ZardMapImports,
    ZardCardImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardProgressComponent,
    ZardTableImports,
  ],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Visitors by region" />
        <z-card-description zDescription="Sessions over the last 30 days" />
        <z-card-action>
          <z-badge zType="secondary">{{ total }} visitors</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [center]="[10, 22]" [zoom]="1.3" (mapReady)="map = $event">
            <ng-map-controls />
            @for (region of regions; track region.name) {
              <ng-map-marker [longitude]="region.lng" [latitude]="region.lat" [ariaLabel]="region.name">
                <ng-marker-content>
                  <div
                    class="bg-primary/25 ring-primary/70 rounded-full ring-2 backdrop-blur-[1px] transition-transform"
                    [class.scale-125]="active() === region.name"
                    [style.width.px]="size(region)"
                    [style.height.px]="size(region)"
                  ></div>
                </ng-marker-content>
                <ng-marker-tooltip>{{ region.name }} · {{ region.visitors.toLocaleString('en-US') }}</ng-marker-tooltip>
              </ng-map-marker>
            }
          </ng-map>
        </div>

        <div class="flex flex-col gap-3 lg:col-span-2">
          <table z-table>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">Region</th>
                <th z-table-head scope="col" class="text-right">Visitors</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (region of ranked(); track region.name) {
                <tr
                  z-table-row
                  class="cursor-pointer"
                  tabindex="0"
                  (click)="focusOn(region)"
                  (keydown.enter)="focusOn(region)"
                  (mouseenter)="active.set(region.name)"
                  (mouseleave)="active.set(null)"
                  (focus)="active.set(region.name)"
                  (blur)="active.set(null)"
                >
                  <td z-table-cell class="w-full">
                    <div class="flex flex-col gap-1.5">
                      <span class="font-medium">{{ region.name }}</span>
                      <z-progress [value]="(region.visitors / max) * 100" class="h-1.5" />
                    </div>
                  </td>
                  <td z-table-cell class="text-right align-top tabular-nums">
                    {{ region.visitors.toLocaleString('en-US') }}
                    <span class="text-muted-foreground block text-xs">{{ share(region) }}%</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <button z-button zType="outline" zSize="sm" class="self-start" (click)="reset()">Reset view</button>
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockAnalyticsMapComponent {
  protected map: MapLibreMap | null = null;

  protected readonly regions = REGIONS;
  protected readonly max = MAX;
  protected readonly total = TOTAL.toLocaleString('en-US');
  protected readonly active = signal<string | null>(null);
  protected readonly ranked = computed(() => [...REGIONS].sort((a, b) => b.visitors - a.visitors));

  protected size(region: Region): number {
    return 14 + Math.sqrt(region.visitors / MAX) * 40;
  }

  protected share(region: Region): string {
    return ((region.visitors / TOTAL) * 100).toFixed(1);
  }

  protected focusOn(region: Region): void {
    this.map?.flyTo({ center: [region.lng, region.lat], zoom: 3.6, duration: 1400, essential: true });
  }

  protected reset(): void {
    this.map?.flyTo({ center: [10, 22], zoom: 1.3, duration: 1200, essential: true });
  }
}
