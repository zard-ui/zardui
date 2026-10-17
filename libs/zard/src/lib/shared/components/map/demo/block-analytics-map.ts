import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardChartComponent } from '@/shared/components/chart/chart.component';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';
import { ZardMapImports } from '@/shared/components/map/map.imports';

/*
 * Layout after the analytics block of ng-mapcn (MIT): a world map, stats floating over it and breakdown cards under it.
 * The countries are drawn from GeoJSON on a blank basemap, so the block reads the same in every map style.
 */

interface Visitor {
  city: string;
  lng: number;
  lat: number;
  size: number;
}

interface BreakdownRow {
  label: string;
  value: number;
}

const VISITORS: Visitor[] = [
  { city: 'San Francisco', lng: -122.4194, lat: 37.7749, size: 16 },
  { city: 'New York', lng: -74.006, lat: 40.7128, size: 15 },
  { city: 'Toronto', lng: -79.3832, lat: 43.6532, size: 11 },
  { city: 'Mexico City', lng: -99.1332, lat: 19.4326, size: 10 },
  { city: 'Sao Paulo', lng: -46.6333, lat: -23.5505, size: 12 },
  { city: 'Buenos Aires', lng: -58.3816, lat: -34.6037, size: 9 },
  { city: 'London', lng: -0.1276, lat: 51.5074, size: 14 },
  { city: 'Berlin', lng: 13.405, lat: 52.52, size: 11 },
  { city: 'Paris', lng: 2.3522, lat: 48.8566, size: 13 },
  { city: 'Madrid', lng: -3.7038, lat: 40.4168, size: 10 },
  { city: 'Cairo', lng: 31.2357, lat: 30.0444, size: 9 },
  { city: 'Lagos', lng: 3.3792, lat: 6.5244, size: 10 },
  { city: 'Mumbai', lng: 72.8777, lat: 19.076, size: 13 },
  { city: 'Dubai', lng: 55.2708, lat: 25.2048, size: 11 },
  { city: 'Seoul', lng: 126.978, lat: 37.5665, size: 12 },
  { city: 'Singapore', lng: 103.8198, lat: 1.3521, size: 10 },
  { city: 'Tokyo', lng: 139.6917, lat: 35.6895, size: 12 },
  { city: 'Sydney', lng: 151.2093, lat: -33.8688, size: 9 },
  { city: 'Auckland', lng: 174.7633, lat: -36.8485, size: 8 },
];

const USERS_PER_DAY = [
  420, 468, 512, 390, 540, 305, 268, 498, 610, 472, 845, 690, 360, 322, 588, 654, 720, 505, 932, 410, 372, 640, 712,
  598, 1040, 805, 445, 398, 702, 868,
].map((users, index) => ({ day: String(index + 1), users }));

const DEVICES = [
  { name: 'Desktop', value: 73.3, fill: 'var(--chart-1)' },
  { name: 'Mobile', value: 25.0, fill: 'var(--chart-2)' },
  { name: 'Tablet', value: 1.7, fill: 'var(--chart-3)' },
];

const CARDS: { title: string; rows: BreakdownRow[] }[] = [
  {
    title: 'Visited pages',
    rows: [
      { label: 'Home', value: 31 },
      { label: 'Pricing', value: 23 },
      { label: 'Docs / Basic Map', value: 18 },
      { label: 'Installation', value: 12 },
      { label: 'Components', value: 9 },
      { label: 'Blog', value: 6 },
    ],
  },
  {
    title: 'Referrers',
    rows: [
      { label: 'google', value: 38 },
      { label: 'direct', value: 26 },
      { label: 'github.com', value: 19 },
      { label: 'x.com', value: 11 },
      { label: 'ui.shadcn.com', value: 8 },
      { label: 'other', value: 5 },
    ],
  },
  {
    title: 'Countries',
    rows: [
      { label: 'United States', value: 27 },
      { label: 'India', value: 14 },
      { label: 'United Kingdom', value: 8 },
      { label: 'Germany', value: 6 },
      { label: 'Japan', value: 4 },
      { label: 'Australia', value: 2 },
    ],
  },
  {
    title: 'Browsers',
    rows: [
      { label: 'Chrome', value: 52 },
      { label: 'Safari', value: 21 },
      { label: 'Firefox', value: 14 },
      { label: 'Edge', value: 8 },
      { label: 'Other', value: 5 },
    ],
  },
];

const BREAKDOWNS = CARDS.map(card => ({ ...card, max: Math.max(...card.rows.map(row => row.value)) }));

/** Natural Earth countries (public domain). Swap in your own GeoJSON to change the regions. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson';

@Component({
  selector: 'z-demo-map-block-analytics-map',
  imports: [DecimalPipe, NgIcon, ZardCardComponent, ZardChartComponent, ZardMapImports],
  template: `
    <div class="bg-background @container flex size-full flex-col">
      <!-- The map fills this area edge to edge; the stats float over it. -->
      <div class="relative h-104 shrink-0 @3xl:h-152">
        <ng-map [blank]="true" [center]="[-2, 16]" [zoom]="compact ? 0.3 : 1.4" [options]="mapOptions">
          <ng-map-geojson [data]="countries" [linePaint]="false" />
          <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
          @for (visitor of visitors; track visitor.city) {
            <ng-map-marker [longitude]="visitor.lng" [latitude]="visitor.lat">
              <ng-marker-content>
                <div
                  class="bg-chart-2/70 ring-chart-2/40 hover:bg-chart-2/90 rounded-full ring-4 transition-[transform,background-color] hover:scale-110"
                  [style.width.px]="visitor.size * 3"
                  [style.height.px]="visitor.size * 3"
                ></div>
              </ng-marker-content>
              <ng-marker-tooltip>{{ visitor.city }} · {{ visitor.size }} active users</ng-marker-tooltip>
            </ng-map-marker>
          }
        </ng-map>

        <div
          class="to-background pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent"
          aria-hidden="true"
        ></div>

        <z-card
          class="bg-card/85 absolute top-3 left-3 z-10 w-52 gap-1 shadow-sm backdrop-blur-sm @3xl:top-4 @3xl:left-4 @3xl:w-60"
        >
          <div class="px-4 pb-2">
            <p class="text-muted-foreground pb-2 text-[10px] tracking-wider uppercase">Users in last 30 days</p>
            <p class="text-3xl leading-none font-semibold tabular-nums">17,234</p>
          </div>

          <z-chart
            zType="area"
            class="aspect-auto h-14 w-full px-1"
            [zConfig]="usersConfig"
            [zData]="usersPerDay"
            [zSeries]="usersSeries"
            zXAxisKey="day"
            [zXAxis]="false"
            [zGrid]="false"
            [zGradient]="true"
            [zSsrHeight]="56"
          />
          <div class="flex items-center gap-1.5 px-4 pt-1 text-xs">
            <ng-icon name="lucideTrendingUp" class="text-chart-3" size="12" aria-hidden="true" />
            <span class="font-medium">+12.5%</span>
            <span class="text-muted-foreground">vs previous 30 days</span>
          </div>

          <div class="border-border/60 mx-4 mt-3 hidden border-t pt-3 @3xl:block">
            <p class="text-muted-foreground text-[10px] tracking-wider uppercase">Device category in last 30 days</p>

            <z-chart
              zType="pie"
              class="mx-auto mt-3 aspect-square h-32 w-32"
              [zConfig]="devicesConfig"
              [zData]="devices"
              [zSeries]="devicesSeries"
              zNameKey="name"
              [zInnerRadius]="32"
              [zOuterRadius]="52"
              [zSsrWidth]="128"
              [zSsrHeight]="128"
            />

            <div class="mt-3 grid grid-cols-3 gap-2">
              @for (device of devices; track device.name) {
                <div class="text-center">
                  <p
                    class="text-muted-foreground flex items-center justify-center gap-1.5 text-[10px] tracking-wide uppercase"
                  >
                    <span class="size-2 rounded-full" [style.background-color]="device.fill"></span>
                    {{ device.name }}
                  </p>
                  <p class="mt-1 leading-none font-medium tabular-nums">{{ device.value }}%</p>
                </div>
              }
            </div>
          </div>
        </z-card>
      </div>

      <!-- Phones scroll these sideways; wide frames lay them out in a row. -->
      <div
        class="-mt-4 flex min-h-0 flex-1 snap-x snap-mandatory items-start gap-3 overflow-x-auto px-3 pt-0 pb-3 @3xl:mt-0 @3xl:grid @3xl:grid-cols-2 @3xl:items-stretch @3xl:overflow-visible @3xl:p-4 @5xl:grid-cols-4"
      >
        @for (card of breakdowns; track card.title) {
          <z-card class="relative w-64 shrink-0 snap-start gap-2 @3xl:w-auto">
            <p class="px-4 pb-2 text-sm font-medium">{{ card.title }}</p>
            <div
              class="text-muted-foreground mx-4 mb-1 flex items-center justify-between text-[11px] tracking-wider uppercase"
            >
              <span>{{ card.title }}</span>
              <span>Visitors</span>
            </div>
            <div class="flex flex-col gap-1.5 px-2">
              @for (row of card.rows; track row.label) {
                <div class="relative flex items-center justify-between overflow-hidden rounded-md px-2 py-1.5 text-xs">
                  <div
                    class="bg-chart-2/20 absolute inset-y-0 left-0 rounded-md"
                    [style.width.%]="(row.value / card.max) * 100"
                    aria-hidden="true"
                  ></div>
                  <span class="relative truncate pr-2">{{ row.label }}</span>
                  <span class="relative font-medium tabular-nums">{{ row.value | number }}</span>
                </div>
              }
            </div>
          </z-card>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrendingUp })],
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockAnalyticsMapComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  protected readonly countries = COUNTRIES;
  protected readonly visitors = VISITORS;
  protected readonly breakdowns = BREAKDOWNS;
  protected readonly usersPerDay = USERS_PER_DAY;
  protected readonly devices = DEVICES;

  protected readonly usersConfig = { users: { label: 'Users', color: 'var(--chart-2)' } } satisfies ZardChartConfig;
  protected readonly usersSeries: ZardChartSeries[] = [
    { dataKey: 'users', smooth: true, strokeWidth: 1.5, showSymbol: false },
  ];

  protected readonly devicesConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
    tablet: { label: 'Tablet', color: 'var(--chart-3)' },
  } satisfies ZardChartConfig;

  protected readonly devicesSeries: ZardChartSeries[] = [{ dataKey: 'value', strokeWidth: 2 }];

  /** Scrolling the page must not zoom the map, and the view stays on the world. */
  protected readonly mapOptions = {
    minZoom: globalThis.matchMedia?.('(min-width: 816px)').matches ? 1.4 : 0,
    maxZoom: 4,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
  };
}
