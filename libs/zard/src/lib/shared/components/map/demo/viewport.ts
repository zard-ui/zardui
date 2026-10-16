import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { MapViewport } from 'ng-mapcn';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

const PLACES: { name: string; viewport: MapViewport }[] = [
  { name: 'Tokyo', viewport: { center: [139.6917, 35.6895], zoom: 10, bearing: 0, pitch: 0 } },
  { name: 'New York', viewport: { center: [-74.006, 40.7128], zoom: 11, bearing: 29, pitch: 45 } },
  { name: 'Cape Town', viewport: { center: [18.4241, -33.9249], zoom: 10.5, bearing: 0, pitch: 0 } },
];

@Component({
  selector: 'z-demo-map-viewport',
  imports: [ZardMapImports, ZardButtonComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        @for (place of places; track place.name) {
          <button z-button zType="outline" zSize="sm" type="button" (click)="viewport.set(place.viewport)">
            {{ place.name }}
          </button>
        }
      </div>

      <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
        <!-- The map reports every frame, you hand the state back: the viewport is yours. -->
        <ng-map [viewport]="viewport()" (viewportChange)="viewport.set($event)">
          <ng-map-controls [showCompass]="true" />
        </ng-map>

        <dl
          class="bg-popover text-popover-foreground ring-foreground/10 absolute top-3 left-3 grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 rounded-lg px-3 py-2 font-mono text-xs shadow-md ring-1"
          aria-live="off"
        >
          <dt class="text-muted-foreground">lng</dt>
          <dd class="text-right tabular-nums">{{ viewport().center[0].toFixed(4) }}</dd>
          <dt class="text-muted-foreground">lat</dt>
          <dd class="text-right tabular-nums">{{ viewport().center[1].toFixed(4) }}</dd>
          <dt class="text-muted-foreground">zoom</dt>
          <dd class="text-right tabular-nums">{{ viewport().zoom.toFixed(2) }}</dd>
          <dt class="text-muted-foreground">bearing</dt>
          <dd class="text-right tabular-nums">{{ viewport().bearing.toFixed(0) }}°</dd>
          <dt class="text-muted-foreground">pitch</dt>
          <dd class="text-right tabular-nums">{{ viewport().pitch.toFixed(0) }}°</dd>
        </dl>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapViewportComponent {
  protected readonly places = PLACES;
  protected readonly viewport = signal<MapViewport>(PLACES[0].viewport);
}
