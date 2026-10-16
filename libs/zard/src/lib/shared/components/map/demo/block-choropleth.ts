import { ChangeDetectionStrategy, Component, afterNextRender, computed, signal } from '@angular/core';

import type { FeatureCollection, Geometry } from 'geojson';
import type { ExpressionSpecification } from 'maplibre-gl';
import type { MapGeoJSONEvent } from 'ng-mapcn';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardTableImports } from '@/shared/components/table/table.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

interface Country {
  ADM0_A3: string;
  NAME: string;
  POP_EST: number;
  GDP_MD: number;
}

type Metric = 'population' | 'gdp';

/** Natural Earth countries (public domain), with population and GDP on every feature. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

const METRICS: Record<
  Metric,
  { label: string; property: keyof Country; steps: [number, string][]; format: (value: number) => string }
> = {
  population: {
    label: 'Population',
    property: 'POP_EST',
    steps: [
      [0, '#dbeafe'],
      [1e7, '#93c5fd'],
      [5e7, '#60a5fa'],
      [1e8, '#3b82f6'],
      [3e8, '#1d4ed8'],
    ],
    format: value => (value >= 1e9 ? `${(value / 1e9).toFixed(2)} B` : `${(value / 1e6).toFixed(1)} M`),
  },
  gdp: {
    label: 'GDP',
    property: 'GDP_MD',
    steps: [
      [0, '#dcfce7'],
      [5e4, '#86efac'],
      [3e5, '#4ade80'],
      [1e6, '#16a34a'],
      [5e6, '#166534'],
    ],
    // GDP_MD is in millions of US dollars.
    format: value => (value >= 1e6 ? `$${(value / 1e6).toFixed(1)} T` : `$${(value / 1e3).toFixed(0)} B`),
  },
};

const EMPTY: FeatureCollection<Geometry, Country> = { type: 'FeatureCollection', features: [] };

@Component({
  selector: 'z-demo-map-block-choropleth',
  imports: [ZardMapImports, ZardCardImports, ZardTableImports, ZardToggleGroupComponent],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Countries at a glance" />
        <z-card-description zDescription="Color the map by one measure and hover a country" />
        <z-card-action>
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="metrics"
            [zDefaultValue]="metric()"
            (valueChange)="onMetricChange($event)"
          />
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [blank]="true" [center]="[12, 28]" [zoom]="1.35">
            <ng-map-controls />
            <ng-map-geojson
              [data]="data()"
              promoteId="ADM0_A3"
              [interactive]="true"
              [fillPaint]="fillPaint()"
              [fillHoverPaint]="{ 'fill-color': '#f97316' }"
              [linePaint]="{ 'line-color': '#94a3b8', 'line-width': 0.5 }"
              (featureHover)="onHover($event)"
            />
          </ng-map>

          <div
            class="bg-popover text-popover-foreground ring-foreground/10 absolute top-3 left-3 rounded-lg px-3 py-2 text-sm shadow-md ring-1"
            aria-live="polite"
          >
            @if (hovered(); as country) {
              <span class="font-medium">{{ country.NAME }}</span>
              <span class="text-muted-foreground">· {{ format(country) }}</span>
            } @else {
              <span class="text-muted-foreground">Hover a country</span>
            }
          </div>

          <ul
            class="bg-popover text-popover-foreground ring-foreground/10 absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-lg px-3 py-2 text-xs shadow-md ring-1"
            [attr.aria-label]="active().label + ' legend'"
          >
            @for (step of active().steps; track step[0]) {
              <li class="flex items-center gap-1.5">
                <span class="size-3 rounded-sm" [style.background]="step[1]"></span>
                {{ active().format(step[0]) }}{{ $last ? '+' : '' }}
              </li>
            }
          </ul>
        </div>

        <div class="lg:col-span-2">
          <table z-table>
            <caption z-table-caption class="sr-only">Top five countries by {{ active().label }}</caption>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">Country</th>
                <th z-table-head scope="col" class="text-right">{{ active().label }}</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (country of top(); track country.ADM0_A3) {
                <tr z-table-row>
                  <td z-table-cell class="font-medium">{{ country.NAME }}</td>
                  <td z-table-cell class="text-right tabular-nums">{{ format(country) }}</td>
                </tr>
              } @empty {
                <tr z-table-row>
                  <td z-table-cell colspan="2" class="text-muted-foreground h-24 text-center">Loading countries...</td>
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
export class ZardDemoMapBlockChoroplethComponent {
  protected readonly metric = signal<Metric>('population');
  protected readonly data = signal<FeatureCollection<Geometry, Country>>(EMPTY);
  protected readonly hovered = signal<Country | null>(null);

  protected readonly metrics: ZardToggleGroupItem[] = [
    { value: 'population', label: 'Population' },
    { value: 'gdp', label: 'GDP' },
  ];

  protected readonly active = computed(() => METRICS[this.metric()]);

  protected readonly fillPaint = computed(() => {
    const { property, steps } = this.active();
    const [first, ...rest] = steps;
    const expression = ['step', ['get', property], first[1], ...rest.flat()] as ExpressionSpecification;

    return { 'fill-color': expression, 'fill-opacity': 0.88 };
  });

  protected readonly top = computed(() => {
    const { property } = this.active();
    return this.data()
      .features.map(feature => feature.properties)
      .sort((a, b) => Number(b[property]) - Number(a[property]))
      .slice(0, 5);
  });

  constructor() {
    afterNextRender(async () => {
      try {
        const response = await fetch(COUNTRIES);
        this.data.set((await response.json()) as FeatureCollection<Geometry, Country>);
      } catch {
        // Offline: the map stays empty and the table keeps its placeholder.
      }
    });
  }

  protected format(country: Country): string {
    const { property, format } = this.active();
    return format(Number(country[property]));
  }

  protected onMetricChange(value: string | string[]): void {
    if (value === 'population' || value === 'gdp') {
      this.metric.set(value);
    }
  }

  protected onHover(event: MapGeoJSONEvent<Country> | null): void {
    this.hovered.set(event?.feature.properties ?? null);
  }
}
