import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { ClusterPointClickEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardTableImports } from '@/shared/components/table/table.imports';

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
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardTableImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Customers worldwide" />
        <z-card-description zDescription="Click a cluster to zoom in, or a dot for the customer" />
        <z-card-action>
          <z-badge zType="secondary">{{ customers.features.length }} customers</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [center]="[15, 25]" [zoom]="1.5" (mapReady)="map = $event">
            <ng-map-controls />
            <ng-map-cluster-layer
              [data]="customers"
              [clusterColors]="['#60a5fa', '#3b82f6', '#1d4ed8']"
              [clusterThresholds]="[50, 200]"
              [clusterRadius]="55"
              pointColor="#f97316"
              (pointClick)="onPointClick($event)"
            />
          </ng-map>
        </div>

        <div class="flex flex-col gap-4 lg:col-span-2">
          <div class="rounded-lg border p-4" aria-live="polite">
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

          <table z-table>
            <caption z-table-caption class="sr-only">Customers by city</caption>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">City</th>
                <th z-table-head scope="col" class="text-right">Customers</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (city of cities; track city.name) {
                <tr
                  z-table-row
                  class="cursor-pointer"
                  tabindex="0"
                  (click)="focusOn(city)"
                  (keydown.enter)="focusOn(city)"
                >
                  <td z-table-cell class="font-medium">{{ city.name }}</td>
                  <td z-table-cell class="text-right tabular-nums">{{ city.weight * 60 }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockClustersComponent {
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
