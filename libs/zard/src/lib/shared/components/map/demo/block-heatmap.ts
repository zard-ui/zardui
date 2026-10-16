import { ChangeDetectionStrategy, Component, afterNextRender, computed, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { ExpressionSpecification } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Quake {
  mag: number;
  place: string;
  time: number;
}

/** Every earthquake of magnitude 2.5 or more in the last 30 days, from the USGS (public domain). No key needed. */
const FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

const EMPTY: FeatureCollection<Point, Quake> = { type: 'FeatureCollection', features: [] };

@Component({
  selector: 'z-demo-map-block-heatmap',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardSliderComponent, ZardTableImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Earthquakes, last 30 days" />
        <z-card-description zDescription="Where the ground moved, weighted by magnitude" />
        <z-card-action>
          <z-badge zType="secondary">{{ visible().features.length }} events</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [center]="[145, 8]" [zoom]="1.5">
            <ng-map-controls />
            <ng-map-heatmap
              [data]="visible()"
              weightProperty="mag"
              [weightRange]="[2.5, 7]"
              [radius]="radius"
              [intensity]="1.4"
              [opacity]="0.9"
            />
          </ng-map>
          @if (failed()) {
            <p class="bg-popover text-muted-foreground absolute top-3 left-3 rounded-lg px-3 py-2 text-sm shadow-md">
              The USGS feed could not be loaded.
            </p>
          }
        </div>

        <div class="flex flex-col gap-5 lg:col-span-2">
          <div class="flex flex-col gap-3">
            <div class="flex items-baseline justify-between text-sm">
              <label id="minimum-magnitude" class="font-medium">Minimum magnitude</label>
              <span class="text-muted-foreground tabular-nums">M {{ minimum().toFixed(1) }}+</span>
            </div>
            <z-slider
              aria-labelledby="minimum-magnitude"
              [zMin]="2.5"
              [zMax]="6.5"
              [zStep]="0.1"
              [zValue]="[minimum()]"
              (zSlideIndexChange)="minimum.set($event[0])"
            />
          </div>

          <table z-table>
            <caption z-table-caption class="sr-only">Strongest earthquakes</caption>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">Place</th>
                <th z-table-head scope="col" class="text-right">Magnitude</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (quake of strongest(); track quake.time) {
                <tr z-table-row>
                  <td z-table-cell class="max-w-48 truncate">{{ quake.place }}</td>
                  <td z-table-cell class="text-right font-medium tabular-nums">{{ quake.mag.toFixed(1) }}</td>
                </tr>
              } @empty {
                <tr z-table-row>
                  <td z-table-cell colspan="2" class="text-muted-foreground h-24 text-center">
                    {{ failed() ? 'No data' : 'Loading earthquakes...' }}
                  </td>
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
export class ZardDemoMapBlockHeatmapComponent {
  protected readonly quakes = signal<FeatureCollection<Point, Quake>>(EMPTY);
  protected readonly failed = signal(false);
  protected readonly minimum = signal(2.5);

  /** A new collection only when the slider moves: the heatmap pushes data to the map when the reference changes. */
  protected readonly visible = computed<FeatureCollection<Point, Quake>>(() => ({
    type: 'FeatureCollection',
    features: this.quakes().features.filter(feature => feature.properties.mag >= this.minimum()),
  }));

  protected readonly strongest = computed(() =>
    this.visible()
      .features.map(feature => feature.properties)
      .sort((a, b) => b.mag - a.mag)
      .slice(0, 5),
  );

  /** The radius grows with the zoom, so the heat keeps its shape as you move in. */
  protected readonly radius: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 0, 8, 4, 22, 8, 40];

  constructor() {
    afterNextRender(async () => {
      try {
        const response = await fetch(FEED);
        this.quakes.set((await response.json()) as FeatureCollection<Point, Quake>);
      } catch {
        this.failed.set(true);
      }
    });
  }
}
