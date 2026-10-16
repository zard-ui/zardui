import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideTrash2 } from '@ng-icons/lucide';
import type { MapDrawFeature, MapDrawFeatureCollection, MapDrawMode } from 'ng-mapcn/draw';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapDrawImports } from '@/shared/components/map-draw/map-draw.imports';
import { ZardTableImports } from '@/shared/components/table/table.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const EARTH_RADIUS_M = 6_371_008.8;
const toRad = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance in meters (haversine). */
function distance([lng1, lat1]: number[], [lng2, lat2]: number[]): number {
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** Area of a polygon ring on the sphere, in square meters. */
function ringArea(ring: number[][]): number {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[i + 1];
    sum += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  return Math.abs((sum * EARTH_RADIUS_M ** 2) / 2);
}

function describe(feature: MapDrawFeature): { kind: string; value: string } {
  const { geometry } = feature;

  switch (geometry.type) {
    case 'Point':
      return { kind: 'Point', value: `${geometry.coordinates[1].toFixed(4)}, ${geometry.coordinates[0].toFixed(4)}` };
    case 'LineString': {
      const meters = geometry.coordinates
        .slice(1)
        .reduce((sum, point, i) => sum + distance(geometry.coordinates[i], point), 0);
      return { kind: 'Line', value: meters < 1000 ? `${meters.toFixed(0)} m` : `${(meters / 1000).toFixed(2)} km` };
    }
    case 'Polygon': {
      const km2 = ringArea(geometry.coordinates[0]) / 1e6;
      return { kind: 'Polygon', value: km2 < 1 ? `${(km2 * 1e6).toFixed(0)} m²` : `${km2.toFixed(2)} km²` };
    }
  }
}

@Component({
  selector: 'z-demo-map-block-draw',
  imports: [
    ZardMapDrawImports,
    ZardCardImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardTableImports,
    ZardToggleGroupComponent,
    NgIcon,
  ],
  template: `
    <div class="grid w-full gap-4 lg:grid-cols-4">
      <div class="h-96 overflow-hidden rounded-xl border lg:col-span-3 lg:h-136">
        <ng-map [center]="[-73.9654, 40.7829]" [zoom]="12.8">
          <ng-map-controls />
          <ng-map-draw
            [(mode)]="mode"
            [(features)]="features"
            [modes]="['point', 'line', 'polygon']"
            [editable]="true"
          />
        </ng-map>
      </div>

      <z-card class="gap-4">
        <z-card-header>
          <z-card-title zTitle="Draw on the map" />
          <z-card-description zDescription="Sketch an area, a route or a few points of interest" />
          <z-card-action>
            <z-badge zType="secondary">{{ features().features.length }}</z-badge>
          </z-card-action>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          <z-toggle-group
            class="flex-wrap"
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="modes"
            [zValue]="mode()"
            (valueChange)="onModeChange($event)"
          />

          <table z-table>
            <caption z-table-caption class="sr-only">Drawn features</caption>
            <tbody z-table-body>
              @for (item of rows(); track item.id) {
                <tr z-table-row>
                  <td z-table-cell class="font-medium">{{ item.kind }}</td>
                  <td z-table-cell class="text-right tabular-nums">{{ item.value }}</td>
                  <td z-table-cell class="w-10 text-right">
                    <button
                      z-button
                      zType="ghost"
                      zSize="icon-sm"
                      type="button"
                      [attr.aria-label]="'Delete ' + item.kind.toLowerCase()"
                      (click)="remove(item.id)"
                    >
                      <ng-icon name="lucideTrash2" />
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr z-table-row>
                  <td z-table-cell colspan="3" class="text-muted-foreground h-20 text-center text-xs">
                    Pick a tool, then click the map. Double-click or press Enter to finish a shape.
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="flex gap-2">
            <button z-button zType="outline" zSize="sm" type="button" [disabled]="!rows().length" (click)="copy()">
              <ng-icon name="lucideCopy" />
              {{ copied() ? 'Copied' : 'Copy GeoJSON' }}
            </button>
            <button z-button zType="ghost" zSize="sm" type="button" [disabled]="!rows().length" (click)="clear()">
              Clear
            </button>
          </div>
        </z-card-content>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCopy, lucideTrash2 })],
})
export class ZardDemoMapBlockDrawComponent {
  protected readonly mode = signal<MapDrawMode>('polygon');
  protected readonly features = signal<MapDrawFeatureCollection>({ type: 'FeatureCollection', features: [] });
  protected readonly copied = signal(false);

  protected readonly rows = computed(() =>
    this.features().features.map(feature => ({
      id: feature.id as string | number,
      ...describe(feature as MapDrawFeature),
    })),
  );

  protected readonly modes: ZardToggleGroupItem[] = [
    { value: 'select', label: 'Select' },
    { value: 'point', label: 'Point' },
    { value: 'line', label: 'Line' },
    { value: 'polygon', label: 'Polygon' },
  ];

  protected onModeChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.mode.set(value as MapDrawMode);
    }
  }

  protected remove(id: string | number): void {
    this.features.update(current => ({ ...current, features: current.features.filter(feature => feature.id !== id) }));
  }

  protected clear(): void {
    this.features.set({ type: 'FeatureCollection', features: [] });
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(JSON.stringify(this.features(), null, 2));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard access can be blocked: nothing to recover, the button just stays as it is.
    }
  }
}
