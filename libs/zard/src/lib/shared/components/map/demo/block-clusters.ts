import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { ClusterPointClickEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Customer {
  id: number;
  city: string;
  plan: 'Free' | 'Pro' | 'Team';
}

const CITIES: { name: string; lng: number; lat: number; weight: number }[] = [
  { name: 'London', lng: -0.1276, lat: 51.5072, weight: 9 },
  { name: 'Paris', lng: 2.3522, lat: 48.8566, weight: 8 },
  { name: 'New York', lng: -74.006, lat: 40.7128, weight: 10 },
  { name: 'São Paulo', lng: -46.6333, lat: -23.5505, weight: 7 },
  { name: 'Tokyo', lng: 139.6917, lat: 35.6895, weight: 8 },
  { name: 'Sydney', lng: 151.2093, lat: -33.8688, weight: 4 },
  { name: 'Lagos', lng: 3.3792, lat: 6.5244, weight: 3 },
  { name: 'Mumbai', lng: 72.8777, lat: 19.076, weight: 6 },
  { name: 'Mexico City', lng: -99.1332, lat: 19.4326, weight: 4 },
];

const PLANS: Customer['plan'][] = ['Free', 'Free', 'Pro', 'Team'];

/** A small seeded generator, so the block draws the same customers on every load. */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createCustomers(): FeatureCollection<Point, Customer> {
  const next = random(5);
  let id = 0;

  return {
    type: 'FeatureCollection',
    features: CITIES.flatMap(city =>
      Array.from({ length: city.weight * 60 }, () => {
        const angle = next() * Math.PI * 2;
        const spread = 0.5 * next() ** 2;

        return {
          type: 'Feature' as const,
          properties: { id: ++id, city: city.name, plan: PLANS[Math.floor(next() * PLANS.length)] },
          geometry: {
            type: 'Point' as const,
            coordinates: [city.lng + Math.cos(angle) * spread * 1.4, city.lat + Math.sin(angle) * spread],
          },
        };
      }),
    ),
  };
}

@Component({
  selector: 'z-demo-map-block-clusters',
  imports: [ZardMapImports, ZardBadgeComponent, ZardCardComponent],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map
        [center]="[15, 25]"
        [zoom]="compact ? 0.4 : 1.6"
        [options]="{ scrollZoom: false, dragRotate: false }"
        (mapReady)="map = $event"
      >
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <!-- MapLibre paints with colors, not CSS variables: these are the blues of --chart-1 to --chart-5. -->
        <ng-map-cluster-layer
          [data]="customers"
          [clusterColors]="['#8ec5ff', '#2b7fff', '#155dfc']"
          [clusterThresholds]="[50, 200]"
          [clusterRadius]="55"
          pointColor="#193cb8"
          (pointClick)="onPointClick($event)"
        />
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-80 gap-3 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="flex items-start justify-between gap-3 px-4">
          <div>
            <p class="text-sm font-semibold">Customers worldwide</p>
            <p class="text-muted-foreground text-xs">Click a cluster to zoom in, or a dot for the customer</p>
          </div>
          <z-badge zType="secondary" class="shrink-0">{{ customers.features.length }}</z-badge>
        </div>

        <div class="mx-4 rounded-lg border p-3" aria-live="polite">
          @if (selected(); as customer) {
            <p class="text-sm font-medium">Customer #{{ customer.id }}</p>
            <p class="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              {{ customer.city }}
              <z-badge zType="outline">{{ customer.plan }}</z-badge>
            </p>
          } @else {
            <p class="text-muted-foreground text-sm">Select a customer on the map to see the details.</p>
          }
        </div>
      </z-card>

      <z-card class="bg-card/90 absolute top-5 right-5 z-10 hidden w-56 gap-2 shadow-sm backdrop-blur-sm @3xl:flex">
        <p class="px-4 text-sm font-medium">Customers by city</p>
        <ul class="flex flex-col px-2" aria-label="Customers by city">
          @for (city of cities; track city.name) {
            <li>
              <button
                type="button"
                class="hover:bg-accent focus-visible:ring-ring flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                (click)="focusOn(city)"
              >
                <span class="truncate">{{ city.name }}</span>
                <span class="text-muted-foreground tabular-nums">{{ city.weight * 60 }}</span>
              </button>
            </li>
          }
        </ul>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockClustersComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  protected map: MapLibreMap | null = null;
  protected readonly customers = createCustomers();
  protected readonly cities = [...CITIES].sort((a, b) => b.weight - a.weight);
  protected readonly selected = signal<Customer | null>(null);

  protected focusOn(city: { lng: number; lat: number }): void {
    this.map?.flyTo({ center: [city.lng, city.lat], zoom: 7, duration: 1400, essential: true });
  }

  protected onPointClick(event: ClusterPointClickEvent<Customer>): void {
    this.selected.set(event.feature.properties);
  }
}
