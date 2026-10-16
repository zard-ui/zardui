import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@/shared/components/chart/chart.types';
import { ZardMapImports } from '@/shared/components/map/map.imports';

const CITIES: [number, number, number][] = [
  [-0.1276, 51.5072, 9],
  [2.3522, 48.8566, 8],
  [13.405, 52.52, 7],
  [-3.7038, 40.4168, 6],
  [12.4964, 41.9028, 6],
  [4.9041, 52.3676, 5],
  [18.0686, 59.3293, 3],
  [21.0122, 52.2297, 4],
];

/** A small seeded generator, so the card shows the same sessions on every load. */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSessions(): FeatureCollection<Point> {
  const next = random(11);

  return {
    type: 'FeatureCollection',
    features: CITIES.flatMap(([lng, lat, weight]) =>
      Array.from({ length: weight * 14 }, () => {
        const angle = next() * Math.PI * 2;
        const spread = 0.6 * next() ** 2;

        return {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Point' as const,
            coordinates: [lng + Math.cos(angle) * spread * 1.4, lat + Math.sin(angle) * spread],
          },
        };
      }),
    ),
  };
}

@Component({
  selector: 'z-demo-map-block-analytics-card',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardChartImports],
  template: `
    <z-card class="mx-auto w-full max-w-xl gap-0 overflow-hidden py-0">
      <div class="relative h-56">
        <!-- A heatmap of today's sessions, without controls: the card is the interface. -->
        <ng-map
          [center]="[8, 49]"
          [zoom]="3.3"
          [options]="{ interactive: false, attributionControl: { compact: true } }"
        >
          <ng-map-heatmap [data]="sessions" [radius]="22" [intensity]="1.3" [opacity]="0.85" />
        </ng-map>
        <z-badge zType="secondary" class="absolute top-3 left-3 shadow-sm">
          <span class="size-1.5 rounded-full bg-emerald-500"></span>
          Live
        </z-badge>
      </div>

      <z-card-header class="pt-5">
        <z-card-title zTitle="12,480 visitors" />
        <z-card-description zDescription="Europe, last 7 days" />
        <z-card-action>
          <z-badge zType="outline" class="text-emerald-600 dark:text-emerald-400">+8.2%</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="pb-5">
        <z-chart
          zType="bar"
          class="aspect-auto h-28 w-full"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="day"
        >
          <z-chart-tooltip zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockAnalyticsCardComponent {
  protected readonly sessions = createSessions();

  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors', color: 'var(--chart-1)' },
  };

  protected readonly chartData = [
    { day: 'Mon', visitors: 1480 },
    { day: 'Tue', visitors: 1720 },
    { day: 'Wed', visitors: 1650 },
    { day: 'Thu', visitors: 1910 },
    { day: 'Fri', visitors: 2140 },
    { day: 'Sat', visitors: 1790 },
    { day: 'Sun', visitors: 1790 },
  ];

  protected readonly series: ZardChartSeries[] = [{ dataKey: 'visitors', radius: 4 }];
}
