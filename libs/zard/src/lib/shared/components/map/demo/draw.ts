import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';

import type { MapDrawFeature, MapDrawFeatureCollection, MapDrawMode } from 'ng-mapcn/draw';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
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

function formatArea(km2: number): string {
  return km2 < 0.01 ? `${Math.round(km2 * 1e6).toLocaleString('en-US')} m²` : `${km2.toFixed(2)} km²`;
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

function measure(feature: MapDrawFeature): string {
  const { geometry } = feature;

  switch (geometry.type) {
    case 'Point':
      return `${geometry.coordinates[1].toFixed(4)}, ${geometry.coordinates[0].toFixed(4)}`;
    case 'LineString': {
      const meters = geometry.coordinates
        .slice(1)
        .reduce((sum, point, i) => sum + distance(geometry.coordinates[i], point), 0);
      return meters < 1000 ? `${meters.toFixed(0)} m` : `${(meters / 1000).toFixed(2)} km`;
    }
    case 'Polygon': {
      const km2 = ringArea(geometry.coordinates[0]) / 1e6;
      return formatArea(km2);
    }
  }
}

@Component({
  selector: 'z-demo-map-draw',
  imports: [ZardMapDrawImports, ZardToggleGroupComponent, ZardButtonComponent, ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="modes"
          [zValue]="mode()"
          (valueChange)="onModeChange($event)"
        />
        <button
          z-button
          zType="ghost"
          zSize="sm"
          type="button"
          [disabled]="!features().features.length"
          (click)="clear()"
        >
          Clear
        </button>
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-73.9654, 40.7829]" [zoom]="12.8">
          <ng-map-controls />
          <!-- Two-way: [(features)] is a GeoJSON FeatureCollection, [(mode)] the active tool. -->
          <ng-map-draw
            [(mode)]="mode"
            [(features)]="features"
            [modes]="['point', 'line', 'polygon']"
            [editable]="true"
          />
        </ng-map>
      </div>

      <ul class="flex min-h-7 flex-wrap gap-2" aria-label="Drawn features" aria-live="polite">
        @for (feature of readout(); track feature.id) {
          <li>
            <z-badge zType="secondary" class="gap-1.5">
              <span class="font-medium capitalize">{{ feature.kind }}</span>
              <span class="tabular-nums">{{ feature.value }}</span>
            </z-badge>
          </li>
        } @empty {
          <li class="text-muted-foreground text-sm">
            Pick a tool, then click the map. Double-click or press Enter to finish.
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoMapDrawComponent {
  private readonly toolbar = viewChild.required(ZardToggleGroupComponent);

  protected readonly mode = signal<MapDrawMode>('polygon');
  protected readonly features = signal<MapDrawFeatureCollection>({ type: 'FeatureCollection', features: [] });

  protected readonly readout = computed(() =>
    this.features().features.map(feature => ({
      id: feature.id,
      kind: feature.geometry.type === 'LineString' ? 'line' : feature.geometry.type.toLowerCase(),
      value: measure(feature as MapDrawFeature),
    })),
  );

  protected readonly modes: ZardToggleGroupItem[] = [
    { value: 'static', label: 'View' },
    { value: 'select', label: 'Select' },
    { value: 'point', label: 'Point' },
    { value: 'line', label: 'Line' },
    { value: 'polygon', label: 'Polygon' },
  ];

  /** Re-clicking the active tool unpresses it while it keeps drawing, so press it back. */
  protected onModeChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.mode.set(value as MapDrawMode);
    } else {
      this.toolbar().writeValue(this.mode());
    }
  }

  protected clear(): void {
    this.features.set({ type: 'FeatureCollection', features: [] });
  }
}
