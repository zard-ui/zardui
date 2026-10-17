import { ChangeDetectionStrategy, Component, afterNextRender, computed, signal } from '@angular/core';

import type { FeatureCollection, Point } from 'geojson';
import type { ExpressionSpecification } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

interface Quake {
  mag: number;
  place: string;
  time: number;
}

/** Every earthquake of magnitude 2.5 or more in the last 30 days, from the USGS (public domain). No key needed. */
const FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

const MIN_MAGNITUDE = 2.5;
const MAX_MAGNITUDE = 6.5;

const EMPTY: FeatureCollection<Point, Quake> = { type: 'FeatureCollection', features: [] };

@Component({
  selector: 'z-demo-map-block-heatmap',
  imports: [ZardMapImports, ZardBadgeComponent, ZardCardComponent, ZardSliderComponent],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map [center]="[150, 10]" [zoom]="compact ? 0.6 : 1.8" [options]="mapOptions">
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <ng-map-heatmap
          [data]="visible()"
          weightProperty="mag"
          [weightRange]="[2.5, 7]"
          [radius]="radius"
          [intensity]="1.4"
          [opacity]="0.9"
        />
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-80 gap-4 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="flex items-start justify-between gap-3 px-4">
          <div>
            <p class="text-sm font-semibold">Earthquakes, last 30 days</p>
            <p class="text-muted-foreground text-xs">Weighted by magnitude</p>
          </div>
          <z-badge zType="secondary" class="shrink-0">{{ visible().features.length }} events</z-badge>
        </div>

        <div class="flex flex-col gap-3 px-4">
          <div class="flex items-baseline justify-between text-sm">
            <label id="minimum-magnitude" class="font-medium">Minimum magnitude</label>
            <span class="text-muted-foreground tabular-nums">M {{ minimum().toFixed(1) }}+</span>
          </div>
          <z-slider
            aria-labelledby="minimum-magnitude"
            [zValue]="[slider()]"
            (zSlideIndexChange)="setMinimum($event[0])"
          />
        </div>

        <div class="hidden flex-col gap-1 px-2 @3xl:flex">
          <p class="text-muted-foreground px-2 pb-1 text-[10px] tracking-wider uppercase">Strongest</p>
          @for (quake of strongest(); track quake.time) {
            <div class="flex items-center justify-between gap-3 rounded-md px-2 py-1 text-xs">
              <span class="truncate">{{ quake.place }}</span>
              <span class="font-medium tabular-nums">M {{ quake.mag.toFixed(1) }}</span>
            </div>
          } @empty {
            <p class="text-muted-foreground px-2 py-3 text-xs">{{ failed() ? 'No data' : 'Loading earthquakes...' }}</p>
          }
        </div>
      </z-card>

      @if (failed()) {
        <p class="bg-popover text-muted-foreground absolute right-3 bottom-3 rounded-lg px-3 py-2 text-sm shadow-md">
          The USGS feed could not be loaded.
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockHeatmapComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  /** The camera is padded by the card over the map, so the Pacific is centered in what is left of the frame. */
  protected readonly mapOptions = {
    scrollZoom: false,
    dragRotate: false,
    padding: globalThis.matchMedia?.('(min-width: 816px)').matches
      ? { left: 360, top: 16, bottom: 16, right: 16 }
      : { top: 16, bottom: 16, left: 16, right: 16 },
  };

  protected readonly quakes = signal<FeatureCollection<Point, Quake>>(EMPTY);
  protected readonly failed = signal(false);
  protected readonly minimum = signal(MIN_MAGNITUDE);
  /** The slider runs from 0 to 100, so a range of values is mapped onto it. */
  protected readonly slider = computed(
    () => ((this.minimum() - MIN_MAGNITUDE) / (MAX_MAGNITUDE - MIN_MAGNITUDE)) * 100,
  );

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

  protected setMinimum(percent: number): void {
    this.minimum.set(Math.round((MIN_MAGNITUDE + (percent / 100) * (MAX_MAGNITUDE - MIN_MAGNITUDE)) * 10) / 10);
  }

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
