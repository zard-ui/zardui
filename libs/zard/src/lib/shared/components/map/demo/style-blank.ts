import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { Feature, Polygon } from 'geojson';

import { ZardMapImports } from '@/shared/components/map/map.imports';

/** A delivery zone around the Eiffel Tower. With [blank] there is no basemap behind it. */
const ZONE: Feature<Polygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [2.2945, 48.8584],
        [2.31, 48.8641],
        [2.3262, 48.8606],
        [2.3301, 48.8512],
        [2.3128, 48.8449],
        [2.2965, 48.8478],
        [2.2945, 48.8584],
      ],
    ],
  },
};

@Component({
  selector: 'z-demo-map-style-blank',
  imports: [ZardMapImports],
  template: `
    <!-- [blank] swaps the basemap for an empty, transparent style: whatever is behind the map shows through. -->
    <div class="bg-muted/40 h-[320px] w-full overflow-hidden rounded-xl border">
      <ng-map [blank]="true" [center]="[2.3125, 48.8546]" [zoom]="12.6">
        <ng-map-geojson
          [data]="zone"
          [fillPaint]="{ 'fill-color': '#6366f1', 'fill-opacity': 0.25 }"
          [linePaint]="{ 'line-color': '#6366f1', 'line-width': 2 }"
        />
        <ng-map-marker [longitude]="2.2945" [latitude]="48.8584" ariaLabel="Eiffel Tower">
          <ng-marker-content />
          <ng-marker-tooltip>Eiffel Tower</ng-marker-tooltip>
        </ng-map-marker>
      </ng-map>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStyleBlankComponent {
  protected readonly zone = ZONE;
}
