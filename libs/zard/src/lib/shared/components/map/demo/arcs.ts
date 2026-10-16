import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { MapArcDatum, MapArcEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Flight extends MapArcDatum {
  label: string;
  duration: string;
}

/** Extra keys on a datum travel with it: they come back in the events and are readable from paint expressions. */
const FLIGHTS: Flight[] = [
  { id: 'jfk-lhr', from: [-73.7781, 40.6413], to: [-0.4543, 51.47], label: 'New York to London', duration: '7 h' },
  { id: 'lhr-dxb', from: [-0.4543, 51.47], to: [55.3644, 25.2532], label: 'London to Dubai', duration: '7 h 10 min' },
  {
    id: 'dxb-sin',
    from: [55.3644, 25.2532],
    to: [103.9915, 1.3644],
    label: 'Dubai to Singapore',
    duration: '7 h 20 min',
  },
  {
    id: 'sin-syd',
    from: [103.9915, 1.3644],
    to: [151.1772, -33.9399],
    label: 'Singapore to Sydney',
    duration: '7 h 50 min',
  },
  // Longitudes run past 180: the arc takes the short way across the antimeridian.
  {
    id: 'syd-sfo',
    from: [151.1772, -33.9399],
    to: [-122.379, 37.6213],
    label: 'Sydney to San Francisco',
    duration: '13 h 5 min',
  },
  {
    id: 'sfo-hnd',
    from: [-122.379, 37.6213],
    to: [139.7798, 35.5494],
    label: 'San Francisco to Tokyo',
    duration: '11 h 10 min',
  },
  {
    id: 'hnd-sin',
    from: [139.7798, 35.5494],
    to: [103.9915, 1.3644],
    label: 'Tokyo to Singapore',
    duration: '7 h 40 min',
  },
  {
    id: 'gru-jfk',
    from: [-46.4731, -23.4356],
    to: [-73.7781, 40.6413],
    label: 'São Paulo to New York',
    duration: '10 h',
  },
  {
    id: 'jnb-lhr',
    from: [28.2461, -26.1392],
    to: [-0.4543, 51.47],
    label: 'Johannesburg to London',
    duration: '11 h 20 min',
  },
];

@Component({
  selector: 'z-demo-map-arcs',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[10, 20]" [zoom]="1.2">
        <ng-map-controls />
        <ng-map-arc
          [data]="flights"
          [curvature]="0.25"
          [paint]="{ 'line-color': '#6366f1', 'line-width': 2, 'line-opacity': 0.7 }"
          [hoverPaint]="{ 'line-color': '#f97316', 'line-width': 4, 'line-opacity': 1 }"
          (arcHover)="onHover($event)"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">
        @if (hovered(); as flight) {
          {{ flight.label }} · {{ flight.duration }}
        } @else {
          Hover an arc
        }
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapArcsComponent {
  protected readonly flights = FLIGHTS;
  protected readonly hovered = signal<Flight | null>(null);

  protected onHover(event: MapArcEvent<Flight> | null): void {
    this.hovered.set(event?.arc ?? null);
  }
}
