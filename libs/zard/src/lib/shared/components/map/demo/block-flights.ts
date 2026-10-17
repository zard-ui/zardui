import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { LineLayerSpecification } from 'maplibre-gl';
import type { MapArcDatum, MapArcEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
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
  imports: [ZardMapImports, ZardBadgeComponent, ZardCardComponent, ZardToggleGroupComponent],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map [center]="[15, 22]" [zoom]="compact ? 0.2 : 1.2" [options]="{ scrollZoom: false }">
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <ng-map-arc
          [data]="routes()"
          [curvature]="0.25"
          [paint]="paint"
          [hoverPaint]="{ 'line-color': '#193cb8', 'line-width': 4, 'line-opacity': 1 }"
          (arcHover)="onHover($event)"
        />
        @for (airport of airports; track airport.code) {
          <ng-map-marker
            [longitude]="airport.coordinates[0]"
            [latitude]="airport.coordinates[1]"
            [ariaLabel]="airport.city"
          >
            <ng-marker-content>
              <span
                class="block size-3 rounded-full border-2 shadow-sm"
                [class]="
                  airport.code === origin()
                    ? 'border-background bg-chart-3 scale-125'
                    : 'bg-background border-foreground'
                "
              ></span>
            </ng-marker-content>
            <ng-marker-tooltip>{{ airport.city }} ({{ airport.code }})</ng-marker-tooltip>
          </ng-map-marker>
        }
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-96 gap-3 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="flex items-start justify-between gap-3 px-4">
          <div>
            <p class="text-sm font-semibold">Routes from {{ origin() }}</p>
            <p class="text-muted-foreground text-xs">Pick an origin, then hover an arc to see the flight</p>
          </div>
          <z-badge zType="secondary" class="shrink-0">{{ routes().length }} routes</z-badge>
        </div>

        <div class="px-4">
          <z-toggle-group
            class="flex-wrap"
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="origins"
            [zDefaultValue]="origin()"
            (valueChange)="onOriginChange($event)"
          />
        </div>
      </z-card>

      <z-card class="bg-card/90 absolute top-5 right-5 z-10 hidden w-60 gap-2 shadow-sm backdrop-blur-sm @3xl:flex">
        <p class="px-4 text-sm font-medium">Flights from {{ origin() }}</p>
        <ul class="flex flex-col px-2" aria-label="Flights from {{ origin() }}">
          @for (flight of routes(); track flight.id) {
            <li
              class="flex items-center justify-between gap-3 rounded-md px-2 py-1 text-xs transition-colors"
              [class.bg-accent]="hovered() === flight.id"
            >
              <span class="font-medium">{{ flight.label }}</span>
              <span class="text-muted-foreground tabular-nums">{{ duration(flight) }}</span>
            </li>
          }
        </ul>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockFlightsComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
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
    // MapLibre paints with colors, not CSS variables: this is --chart-2.
    'line-color': '#2b7fff',
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
