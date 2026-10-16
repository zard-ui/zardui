import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { LineLayerSpecification } from 'maplibre-gl';
import type { MapArcDatum, MapArcEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardTableImports } from '@/shared/components/table/table.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

interface Airport {
  code: string;
  city: string;
  coordinates: [number, number];
}

interface Flight extends MapArcDatum {
  code: string;
  label: string;
  hours: number;
}

const AIRPORTS: Airport[] = [
  { code: 'JFK', city: 'New York', coordinates: [-73.7781, 40.6413] },
  { code: 'LHR', city: 'London', coordinates: [-0.4543, 51.47] },
  { code: 'DXB', city: 'Dubai', coordinates: [55.3644, 25.2532] },
  { code: 'SIN', city: 'Singapore', coordinates: [103.9915, 1.3644] },
  { code: 'SYD', city: 'Sydney', coordinates: [151.1772, -33.9399] },
  { code: 'SFO', city: 'San Francisco', coordinates: [-122.379, 37.6213] },
  { code: 'HND', city: 'Tokyo', coordinates: [139.7798, 35.5494] },
  { code: 'GRU', city: 'São Paulo', coordinates: [-46.4731, -23.4356] },
  { code: 'JNB', city: 'Johannesburg', coordinates: [28.2461, -26.1392] },
];

/** Great-circle distance in kilometers (haversine). */
function distance([lng1, lat1]: number[], [lng2, lat2]: number[]): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

/** Every airport flies to every other one, so picking an origin shows its whole fan of routes. */
const FLIGHTS: Flight[] = AIRPORTS.flatMap(from =>
  AIRPORTS.filter(to => to.code !== from.code).map(to => ({
    id: `${from.code}-${to.code}`,
    from: from.coordinates,
    to: to.coordinates,
    code: from.code,
    label: `${from.code} to ${to.code}`,
    // About 850 km/h in the air, plus the climb and the descent.
    hours: distance(from.coordinates, to.coordinates) / 850 + 0.7,
  })),
);

@Component({
  selector: 'z-demo-map-block-flights',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardTableImports, ZardToggleGroupComponent],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Routes from {{ origin() }}" />
        <z-card-description zDescription="Pick an origin, then hover an arc to see the flight" />
        <z-card-action>
          <z-badge zType="secondary">{{ routes().length }} routes</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="flex flex-col gap-4">
        <z-toggle-group
          class="flex-wrap"
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="origins"
          [zDefaultValue]="origin()"
          (valueChange)="onOriginChange($event)"
        />

        <div class="grid gap-6 lg:grid-cols-5">
          <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
            <ng-map [center]="[15, 22]" [zoom]="1.2">
              <ng-map-controls />
              <ng-map-arc
                [data]="routes()"
                [curvature]="0.25"
                [paint]="paint"
                [hoverPaint]="{ 'line-color': '#f97316', 'line-width': 4, 'line-opacity': 1 }"
                (arcHover)="onHover($event)"
              />
              @for (airport of airports; track airport.code) {
                <ng-map-marker
                  [longitude]="airport.coordinates[0]"
                  [latitude]="airport.coordinates[1]"
                  [ariaLabel]="airport.city"
                >
                  <ng-marker-content />
                  <ng-marker-tooltip>{{ airport.city }} ({{ airport.code }})</ng-marker-tooltip>
                </ng-map-marker>
              }
            </ng-map>
          </div>

          <div class="lg:col-span-2">
            <table z-table>
              <caption z-table-caption class="sr-only">Flights from {{ origin() }}</caption>
              <thead z-table-header>
                <tr z-table-row>
                  <th z-table-head scope="col">Route</th>
                  <th z-table-head scope="col" class="text-right">Flight time</th>
                </tr>
              </thead>
              <tbody z-table-body>
                @for (flight of routes(); track flight.id) {
                  <tr z-table-row [class.bg-muted]="hovered() === flight.id">
                    <td z-table-cell class="font-medium">{{ flight.label }}</td>
                    <td z-table-cell class="text-right tabular-nums">{{ duration(flight) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockFlightsComponent {
  protected readonly airports = AIRPORTS;
  protected readonly origin = signal('SYD');
  protected readonly hovered = signal<string | number | null>(null);

  protected readonly origins: ZardToggleGroupItem[] = AIRPORTS.map(airport => ({
    value: airport.code,
    label: airport.code,
  }));

  /** A new array only when the origin changes, so the map pushes new data only then. */
  protected readonly routes = computed(() => FLIGHTS.filter(flight => flight.code === this.origin()));

  protected readonly paint: LineLayerSpecification['paint'] = {
    'line-color': '#6366f1',
    'line-width': 2,
    'line-opacity': 0.75,
  };

  protected onOriginChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.origin.set(value);
    }
  }

  protected onHover(event: MapArcEvent<Flight> | null): void {
    this.hovered.set(event?.arc.id ?? null);
  }

  protected duration(flight: Flight): string {
    const hours = Math.floor(flight.hours);
    const minutes = Math.round((flight.hours - hours) * 60);
    return `${hours} h ${String(minutes).padStart(2, '0')} min`;
  }
}
