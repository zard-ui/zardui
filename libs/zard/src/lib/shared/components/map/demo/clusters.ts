import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { ClusterPointClickEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Store {
  id: number;
  name: string;
}

const CITIES: [string, number, number][] = [
  ['London', -0.1276, 51.5072],
  ['Paris', 2.3522, 48.8566],
  ['Berlin', 13.405, 52.52],
  ['Madrid', -3.7038, 40.4168],
  ['Rome', 12.4964, 41.9028],
  ['Amsterdam', 4.9041, 52.3676],
  ['Vienna', 16.3738, 48.2082],
  ['Warsaw', 21.0122, 52.2297],
  ['Lisbon', -9.1393, 38.7223],
  ['Stockholm', 18.0686, 59.3293],
];

/** A small seeded generator, so the demo draws the same stores on every load. */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStores(count: number): FeatureCollection<Point, Store> {
  const next = random(7);

  return {
    type: 'FeatureCollection',
    features: Array.from({ length: count }, (_, id) => {
      const [city, lng, lat] = CITIES[id % CITIES.length];
      // Most stores sit in the center, a few far out: that is what makes the clusters read well.
      const spread = 0.35 * next() ** 2;
      const angle = next() * Math.PI * 2;

      return {
        type: 'Feature',
        properties: { id, name: `${city} store ${id + 1}` },
        geometry: {
          type: 'Point',
          coordinates: [lng + Math.cos(angle) * spread * 1.5, lat + Math.sin(angle) * spread],
        },
      };
    }),
  };
}

@Component({
  selector: 'z-demo-map-clusters',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[8, 48]" [zoom]="3.6">
        <ng-map-controls />
        <!-- Click a cluster to zoom into it. Click a single point to select it. -->
        <ng-map-cluster-layer
          [data]="stores"
          [clusterColors]="['#60a5fa', '#3b82f6', '#1d4ed8']"
          [clusterThresholds]="[25, 100]"
          pointColor="#f97316"
          (pointClick)="onPointClick($event)"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">
        {{ selected() ?? stores.features.length + ' stores, click a cluster to zoom in' }}
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapClustersComponent {
  protected readonly stores = createStores(600);
  protected readonly selected = signal<string | null>(null);

  protected onPointClick(event: ClusterPointClickEvent<Store>): void {
    this.selected.set(event.feature.properties.name);
  }
}
