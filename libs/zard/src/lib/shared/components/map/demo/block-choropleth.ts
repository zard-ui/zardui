import { ChangeDetectionStrategy, Component, afterNextRender, computed, signal } from '@angular/core';

import type { FeatureCollection, Geometry } from 'geojson';
import type { ExpressionSpecification } from 'maplibre-gl';
import type { MapGeoJSONEvent } from 'ng-mapcn';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
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

/**
 * The blues of the `--chart-1` to `--chart-5` tokens. MapLibre paints with colors, not CSS variables, so the ramp is
 * written out here; change it to match your theme.
 */
const RAMP = ['#dbeafe', '#8ec5ff', '#2b7fff', '#155dfc', '#193cb8'];

const METRICS: Record<
  Metric,
  { label: string; property: keyof Country; steps: [number, string][]; format: (value: number) => string }
> = {
  population: {
    label: 'Population',
    property: 'POP_EST',
    steps: [
      [0, RAMP[0]],
      [1e7, RAMP[1]],
      [5e7, RAMP[2]],
      [1e8, RAMP[3]],
      [3e8, RAMP[4]],
    ],
    format: value =>
      value === 0 ? '0' : value >= 1e9 ? `${(value / 1e9).toFixed(2)} B` : `${(value / 1e6).toFixed(1)} M`,
  },
  gdp: {
    label: 'GDP',
    property: 'GDP_MD',
    steps: [
      [0, RAMP[0]],
      [5e4, RAMP[1]],
      [3e5, RAMP[2]],
      [1e6, RAMP[3]],
      [5e6, RAMP[4]],
    ],
    // GDP_MD is in millions of US dollars.
    format: value => (value >= 1e6 ? `$${(value / 1e6).toFixed(1)} T` : `$${(value / 1e3).toFixed(0)} B`),
  },
};

const EMPTY: FeatureCollection<Geometry, Country> = { type: 'FeatureCollection', features: [] };

@Component({
  selector: 'z-demo-map-block-choropleth',
  imports: [ZardMapImports, ZardCardImports, ZardToggleGroupComponent],
  template: `
    <div class="bg-background relative size-full overflow-hidden">
      <ng-map
        [blank]="true"
        [center]="[12, 28]"
        [zoom]="compact ? 0.3 : 1.35"
        [options]="{ scrollZoom: false, dragRotate: false }"
      >
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <ng-map-geojson
          [data]="data()"
          promoteId="ADM0_A3"
          [interactive]="true"
          [fillPaint]="fillPaint()"
          [fillHoverPaint]="{ 'fill-opacity': 1 }"
          [linePaint]="{ 'line-color': '#94a3b8', 'line-width': 0.4, 'line-opacity': 0.6 }"
          (featureHover)="onHover($event)"
        />
      </ng-map>

      <z-card
        class="bg-card/85 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-72 gap-3 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <z-card-header>
          <z-card-title zTitle="Countries at a glance" />
          <z-card-description zDescription="Color the map by one measure" />
        </z-card-header>
        <z-card-content class="flex flex-col gap-3">
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="metrics"
            [zDefaultValue]="metric()"
            (valueChange)="onMetricChange($event)"
          />
          <p class="min-h-5 text-sm" aria-live="polite">
            @if (hovered(); as country) {
              <span class="font-medium">{{ country.NAME }}</span>
              <span class="text-muted-foreground">· {{ format(country) }}</span>
            } @else {
              <span class="text-muted-foreground">Hover a country</span>
            }
          </p>
        </z-card-content>
      </z-card>

      <z-card class="bg-card/85 absolute top-5 right-5 z-10 hidden w-64 gap-2 shadow-sm backdrop-blur-sm md:flex">
        <p class="px-4 text-sm font-medium">Top five by {{ active().label }}</p>
        <ol class="flex flex-col px-2" [attr.aria-label]="'Top five countries by ' + active().label">
          @for (country of top(); track country.ADM0_A3; let i = $index) {
            <li class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
              <span class="text-muted-foreground w-4 text-xs tabular-nums">{{ i + 1 }}</span>
              <span class="flex-1 truncate">{{ country.NAME }}</span>
              <span class="text-muted-foreground tabular-nums">{{ format(country) }}</span>
            </li>
          } @empty {
            <li class="text-muted-foreground px-2 py-3 text-sm">Loading countries...</li>
          }
        </ol>
      </z-card>

      <div
        class="bg-card/85 ring-foreground/10 absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-lg px-3 py-2 text-xs shadow-sm ring-1 backdrop-blur-sm md:bottom-5 md:left-5"
        role="group"
        [attr.aria-label]="active().label + ' legend'"
      >
        <span class="text-muted-foreground font-medium">{{ active().label }}</span>
        <ul class="flex flex-wrap gap-x-3 gap-y-1">
          @for (step of active().steps; track step[0]) {
            <li class="flex items-center gap-1.5">
              <span class="size-3 rounded-sm" [style.background]="step[1]"></span>
              {{ active().format(step[0]) }}{{ $last ? '+' : '' }}
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockChoroplethComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
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

    return { 'fill-color': expression, 'fill-opacity': 0.85 };
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
