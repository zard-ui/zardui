import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardChartComponent } from '@/shared/components/chart/chart.component';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';
import { ZardMapImports } from '@/shared/components/map/map.imports';

/*
 * After the analytics card of ng-mapcn (MIT): a headline metric floating over a world map. The countries are drawn
 * from GeoJSON on a blank basemap, and the bubbles use the chart tokens, so the block follows the theme.
 */

interface Visitor {
  city: string;
  lng: number;
  lat: number;
  visitors: number;
}

const VISITORS: Visitor[] = [
  { city: 'San Francisco', lng: -122.4194, lat: 37.7749, visitors: 62 },
  { city: 'New York', lng: -74.006, lat: 40.7128, visitors: 58 },
  { city: 'Mexico City', lng: -99.1332, lat: 19.4326, visitors: 22 },
  { city: 'Sao Paulo', lng: -46.6333, lat: -23.5505, visitors: 30 },
  { city: 'London', lng: -0.1276, lat: 51.5074, visitors: 48 },
  { city: 'Berlin', lng: 13.405, lat: 52.52, visitors: 28 },
  { city: 'Madrid', lng: -3.7038, lat: 40.4168, visitors: 18 },
  { city: 'Lagos', lng: 3.3792, lat: 6.5244, visitors: 16 },
  { city: 'Dubai', lng: 55.2708, lat: 25.2048, visitors: 24 },
  { city: 'Mumbai', lng: 72.8777, lat: 19.076, visitors: 40 },
  { city: 'Singapore', lng: 103.8198, lat: 1.3521, visitors: 21 },
  { city: 'Tokyo', lng: 139.6917, lat: 35.6895, visitors: 38 },
  { city: 'Seoul', lng: 126.978, lat: 37.5665, visitors: 26 },
  { city: 'Sydney', lng: 151.2093, lat: -33.8688, visitors: 17 },
];

const WEEK = [
  { day: 'Mon', visitors: 51 },
  { day: 'Tue', visitors: 58 },
  { day: 'Wed', visitors: 55 },
  { day: 'Thu', visitors: 67 },
  { day: 'Fri', visitors: 72 },
  { day: 'Sat', visitors: 61 },
  { day: 'Sun', visitors: 78 },
];

/** Natural Earth countries (public domain). Swap in your own GeoJSON to change the regions. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson';

@Component({
  selector: 'z-demo-map-block-analytics-card',
  imports: [NgIcon, ZardBadgeComponent, ZardCardComponent, ZardChartComponent, ZardMapImports],
  template: `
    <div class="bg-background relative size-full overflow-hidden">
      <ng-map
        [blank]="true"
        [center]="[10, 24]"
        [zoom]="compact ? 0.3 : 1.5"
        [options]="mapOptions"
        class="[&_.maplibregl-canvas]:cursor-default! [&_.maplibregl-canvas-container]:cursor-default!"
      >
        <ng-map-geojson [data]="countries" [linePaint]="false" />
        @for (visitor of visitors; track visitor.city) {
          <ng-map-marker [longitude]="visitor.lng" [latitude]="visitor.lat">
            <ng-marker-content>
              <span
                class="bg-chart-2/70 ring-chart-2/40 block cursor-default rounded-full ring-4"
                [style.width.px]="size(visitor.visitors)"
                [style.height.px]="size(visitor.visitors)"
              ></span>
            </ng-marker-content>
            <ng-marker-tooltip>{{ visitor.city }} · {{ visitor.visitors }}K visitors</ng-marker-tooltip>
          </ng-map-marker>
        }
      </ng-map>

      <z-card class="bg-card/85 absolute top-3 left-3 z-10 w-64 gap-3 shadow-sm backdrop-blur-sm md:top-5 md:left-5">
        <div class="flex items-start justify-between gap-3 px-4">
          <div>
            <p class="text-muted-foreground text-sm">Visitors</p>
            <p class="text-3xl leading-tight font-semibold tabular-nums">418.2K</p>
          </div>
          <z-badge zType="outline" class="mt-0.5 gap-1">
            <ng-icon name="lucideTrendingUp" aria-hidden="true" />
            +12% growth
          </z-badge>
        </div>

        <z-chart
          zType="area"
          class="aspect-auto h-16 w-full px-1"
          [zConfig]="config"
          [zData]="week"
          [zSeries]="series"
          zXAxisKey="day"
          [zXAxis]="false"
          [zGrid]="false"
          [zGradient]="true"
          [zSsrHeight]="64"
        />
        <p class="text-muted-foreground px-4 text-xs">Last 7 days, in thousands of visitors</p>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrendingUp })],
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockAnalyticsCardComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  protected readonly countries = COUNTRIES;
  protected readonly visitors = VISITORS;
  protected readonly week = WEEK;

  protected readonly config = { visitors: { label: 'Visitors', color: 'var(--chart-2)' } } satisfies ZardChartConfig;
  protected readonly series: ZardChartSeries[] = [
    { dataKey: 'visitors', smooth: true, strokeWidth: 1.5, showSymbol: false },
  ];

  /** A decorative card: the map neither pans nor zooms. */
  protected readonly mapOptions = {
    interactive: false,
    attributionControl: { compact: true },
  };

  protected size(visitors: number): number {
    return Math.round(14 + Math.sqrt(visitors) * 4);
  }
}
