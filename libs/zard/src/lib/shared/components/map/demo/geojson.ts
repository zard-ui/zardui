import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { ExpressionSpecification } from 'maplibre-gl';
import type { MapGeoJSONEvent } from 'ng-mapcn';

import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Country {
  ADM0_A3: string;
  NAME: string;
  POP_EST: number;
}

/** Natural Earth countries (public domain). A URL works as well as inline GeoJSON. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

/** The legend: the same steps and colors as the fill expression below. */
const STEPS = [
  { from: 0, color: '#dbeafe', label: '< 10 M' },
  { from: 1e7, color: '#93c5fd', label: '10 M' },
  { from: 5e7, color: '#60a5fa', label: '50 M' },
  { from: 1e8, color: '#3b82f6', label: '100 M' },
  { from: 3e8, color: '#1d4ed8', label: '300 M+' },
];

@Component({
  selector: 'z-demo-map-geojson',
  imports: [ZardMapImports],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <!-- [blank] drops the basemap: the choropleth is the map. -->
      <ng-map [blank]="true" [center]="[10, 25]" [zoom]="1.4">
        <ng-map-controls />
        <ng-map-geojson
          [data]="countries"
          promoteId="ADM0_A3"
          [interactive]="true"
          [fillPaint]="fillPaint"
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
          <span class="text-muted-foreground">· {{ (country.POP_EST / 1e6).toFixed(1) }} M people</span>
        } @else {
          <span class="text-muted-foreground">Hover a country</span>
        }
      </div>

      <ul
        class="bg-popover text-popover-foreground ring-foreground/10 absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 rounded-lg px-3 py-2 text-xs shadow-md ring-1"
        aria-label="Population legend"
      >
        @for (step of steps; track step.from) {
          <li class="flex items-center gap-1.5">
            <span class="size-3 rounded-sm" [style.background]="step.color"></span>
            {{ step.label }}
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapGeojsonComponent {
  protected readonly countries = COUNTRIES;
  protected readonly steps = STEPS;
  protected readonly hovered = signal<Country | null>(null);

  protected readonly fillPaint: { 'fill-color': ExpressionSpecification; 'fill-opacity': number } = {
    'fill-color': [
      'step',
      ['get', 'POP_EST'],
      '#dbeafe',
      1e7,
      '#93c5fd',
      5e7,
      '#60a5fa',
      1e8,
      '#3b82f6',
      3e8,
      '#1d4ed8',
    ],
    'fill-opacity': 0.85,
  };

  protected onHover(event: MapGeoJSONEvent | null): void {
    // The data is a URL, so the compiler cannot know the properties: say what Natural Earth puts in them.
    this.hovered.set((event?.feature.properties as Country | undefined) ?? null);
  }
}
