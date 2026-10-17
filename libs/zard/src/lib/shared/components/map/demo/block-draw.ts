import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideTrash2 } from '@ng-icons/lucide';
import type { MapDrawFeature, MapDrawFeatureCollection, MapDrawMode } from 'ng-mapcn/draw';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapDrawImports } from '@/shared/components/map-draw/map-draw.imports';
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

const SAMPLE: MapDrawFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      id: '39594839-ed7c-4a68-92c4-e7bcd8612044',
      type: 'Feature',
      properties: { mode: 'polygon' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.9814, 40.7681],
            [-73.9581, 40.8003],
            [-73.9498, 40.7968],
            [-73.973, 40.7644],
            [-73.9814, 40.7681],
          ],
        ],
      },
    },
    {
      id: '9fb5609a-7a67-457f-94e9-3004db0ae156',
      type: 'Feature',
      properties: { mode: 'line' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.9819, 40.7681],
          [-73.9855, 40.758],
          [-73.9772, 40.7527],
        ],
      },
    },
    {
      id: 'a4595c68-99e0-4b5a-8c07-abf4a6efd3bf',
      type: 'Feature',
      properties: { mode: 'point' },
      geometry: { type: 'Point', coordinates: [-73.9632, 40.7794] },
    },
  ],
};

@Component({
  selector: 'z-demo-map-block-draw',
  imports: [
    ZardMapDrawImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardCardComponent,
    ZardToggleGroupComponent,
    NgIcon,
  ],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map [center]="[-73.97, 40.775]" [zoom]="12.4" [options]="mapOptions">
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <ng-map-draw [(mode)]="mode" [(features)]="features" [modes]="['point', 'line', 'polygon']" [editable]="true" />
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-80 gap-3 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="flex items-start justify-between gap-3 px-4">
          <div>
            <p class="text-sm font-semibold">Draw on the map</p>
            <p class="text-muted-foreground text-xs">Sketch an area, a route or a few points of interest</p>
          </div>
          <z-badge zType="secondary" class="shrink-0">{{ features().features.length }}</z-badge>
        </div>

        <div class="px-4">
          <z-toggle-group
            class="flex-wrap"
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="modes"
            [zValue]="mode()"
            (valueChange)="onModeChange($event)"
          />
        </div>

        <ul class="hidden flex-col px-2 @3xl:flex" aria-label="Drawn features">
          @for (item of rows(); track item.id) {
            <li class="flex items-center gap-2 rounded-md py-0.5 pr-1 pl-2 text-sm">
              <span class="flex-1 font-medium">{{ item.kind }}</span>
              <span class="text-muted-foreground text-xs tabular-nums">{{ item.value }}</span>
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
            </li>
          } @empty {
            <li class="text-muted-foreground px-2 py-3 text-xs">
              Pick a tool, then click the map. Double-click or press Enter to finish a shape.
            </li>
          }
        </ul>

        <div class="flex gap-2 px-4">
          <button z-button zType="outline" zSize="sm" type="button" [disabled]="!rows().length" (click)="copy()">
            <ng-icon name="lucideCopy" />
            {{ copied() ? 'Copied' : 'Copy GeoJSON' }}
          </button>
          <button z-button zType="ghost" zSize="sm" type="button" [disabled]="!rows().length" (click)="clear()">
            Clear
          </button>
        </div>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCopy, lucideTrash2 })],
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockDrawComponent {
  /** The camera is padded by the card over the map, so the sample shapes sit in what is left of the frame. */
  protected readonly mapOptions = {
    scrollZoom: false,
    padding: globalThis.matchMedia?.('(min-width: 816px)').matches
      ? { left: 360, top: 16, bottom: 16, right: 16 }
      : { top: 260, bottom: 16, left: 16, right: 16 },
  };

  protected readonly mode = signal<MapDrawMode>('select');
  /** A few shapes to start with, so the block is not an empty map. Clear them, or draw your own. */
  protected readonly features = signal<MapDrawFeatureCollection>(SAMPLE);
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
