import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { ExpressionSpecification } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

/** Every earthquake of magnitude 2.5 or more in the last 30 days, from the USGS (public domain). No key needed. */
const EARTHQUAKES = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

@Component({
  selector: 'z-demo-map-heatmap',
  imports: [ZardMapImports, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[150, 10]" [zoom]="1.6">
        <ng-map-controls />
        <!-- A URL is fetched by the map. The weight of each point comes from its magnitude. -->
        <ng-map-heatmap
          [data]="earthquakes"
          weightProperty="mag"
          [weightRange]="[2.5, 7]"
          [radius]="radius"
          [intensity]="1.4"
          [opacity]="0.9"
        />
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3">Earthquakes in the last 30 days · USGS</z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapHeatmapComponent {
  protected readonly earthquakes = EARTHQUAKES;

  /** The radius grows with the zoom, so the heat keeps its shape as you move in. */
  protected readonly radius: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 0, 8, 4, 22, 8, 40];
}
