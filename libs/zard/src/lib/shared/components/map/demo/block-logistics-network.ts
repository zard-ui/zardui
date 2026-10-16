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

type Mode = 'sea' | 'air';
type Filter = 'all' | Mode;

interface Hub {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface Lane extends MapArcDatum {
  mode: Mode;
  /** Containers (sea) or tonnes (air) per week. */
  volume: number;
  label: string;
}

const HUBS: Record<string, Hub> = {
  rtm: { id: 'rtm', name: 'Rotterdam', coordinates: [4.4777, 51.9244] },
  sha: { id: 'sha', name: 'Shanghai', coordinates: [121.4737, 31.2304] },
  sin: { id: 'sin', name: 'Singapore', coordinates: [103.8198, 1.3521] },
  lax: { id: 'lax', name: 'Los Angeles', coordinates: [-118.2437, 33.7405] },
  ssz: { id: 'ssz', name: 'Santos', coordinates: [-46.3322, -23.9608] },
  dxb: { id: 'dxb', name: 'Jebel Ali', coordinates: [55.0272, 25.0118] },
  nyc: { id: 'nyc', name: 'New York', coordinates: [-74.006, 40.7128] },
};

function lane(from: string, to: string, mode: Mode, volume: number): Lane {
  return {
    id: `${from}-${to}-${mode}`,
    from: HUBS[from].coordinates,
    to: HUBS[to].coordinates,
    mode,
    volume,
    label: `${HUBS[from].name} to ${HUBS[to].name}`,
  };
}

const LANES: Lane[] = [
  lane('sha', 'rtm', 'sea', 940),
  lane('sha', 'lax', 'sea', 820),
  lane('sin', 'rtm', 'sea', 610),
  lane('sin', 'dxb', 'sea', 380),
  lane('dxb', 'rtm', 'sea', 340),
  lane('rtm', 'nyc', 'sea', 420),
  lane('ssz', 'rtm', 'sea', 260),
  lane('sha', 'nyc', 'air', 240),
  lane('lax', 'sha', 'air', 190),
  lane('dxb', 'nyc', 'air', 120),
  lane('rtm', 'sin', 'air', 90),
];

@Component({
  selector: 'z-demo-map-block-logistics-network',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardTableImports, ZardToggleGroupComponent],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Freight network" />
        <z-card-description zDescription="Weekly volume between the main hubs" />
        <z-card-action>
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="filters"
            [zDefaultValue]="filter()"
            (valueChange)="onFilterChange($event)"
          />
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [center]="[20, 28]" [zoom]="1.25">
            <ng-map-controls />
            <!-- The width of an arc follows its volume: a paint expression reads the datum with ["get", "volume"]. -->
            <ng-map-arc
              [data]="lanes()"
              [curvature]="0.22"
              [paint]="paint"
              [hoverPaint]="{ 'line-color': '#f97316', 'line-opacity': 1 }"
              (arcHover)="onArcHover($event)"
            />
            @for (hub of hubs; track hub.id) {
              <ng-map-marker [longitude]="hub.coordinates[0]" [latitude]="hub.coordinates[1]" [ariaLabel]="hub.name">
                <ng-marker-content />
                <ng-marker-tooltip>{{ hub.name }}</ng-marker-tooltip>
              </ng-map-marker>
            }
          </ng-map>
        </div>

        <div class="lg:col-span-2">
          <table z-table>
            <caption z-table-caption class="sr-only">Lanes by weekly volume</caption>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">Lane</th>
                <th z-table-head scope="col">Mode</th>
                <th z-table-head scope="col" class="text-right">Volume</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (item of ranked(); track item.id) {
                <tr z-table-row [class.bg-muted]="hovered() === item.id">
                  <td z-table-cell class="font-medium">{{ item.label }}</td>
                  <td z-table-cell>
                    <z-badge [zType]="item.mode === 'sea' ? 'secondary' : 'outline'">
                      {{ item.mode === 'sea' ? 'Sea' : 'Air' }}
                    </z-badge>
                  </td>
                  <td z-table-cell class="text-right tabular-nums">{{ item.volume }}</td>
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
export class ZardDemoMapBlockLogisticsNetworkComponent {
  protected readonly hubs = Object.values(HUBS);
  protected readonly filter = signal<Filter>('all');
  protected readonly hovered = signal<string | number | null>(null);

  protected readonly filters: ZardToggleGroupItem[] = [
    { value: 'all', label: 'All' },
    { value: 'sea', label: 'Sea' },
    { value: 'air', label: 'Air' },
  ];

  /** A new array only when the filter changes, so the map pushes new data only then. */
  protected readonly lanes = computed(() =>
    LANES.filter(item => this.filter() === 'all' || item.mode === this.filter()),
  );

  protected readonly ranked = computed(() => [...this.lanes()].sort((a, b) => b.volume - a.volume));

  protected readonly paint: LineLayerSpecification['paint'] = {
    'line-color': ['match', ['get', 'mode'], 'air', '#a855f7', '#3b82f6'],
    'line-width': ['interpolate', ['linear'], ['get', 'volume'], 80, 1.5, 950, 6],
    'line-opacity': 0.75,
  };

  protected onFilterChange(value: string | string[]): void {
    if (value === 'all' || value === 'sea' || value === 'air') {
      this.filter.set(value);
    }
  }

  protected onArcHover(event: MapArcEvent<Lane> | null): void {
    this.hovered.set(event?.arc.id ?? null);
  }
}
