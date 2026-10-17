import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type Peak = 'matterhorn' | 'fuji' | 'grand-canyon';

const PEAKS: Record<
  Peak,
  { name: string; elevation: string; center: [number, number]; zoom: number; bearing: number; pitch: number }
> = {
  matterhorn: {
    name: 'Matterhorn',
    elevation: '4,478 m',
    center: [7.6586, 45.9763],
    zoom: 11.8,
    bearing: 28,
    pitch: 72,
  },
  fuji: { name: 'Mount Fuji', elevation: '3,776 m', center: [138.7274, 35.3606], zoom: 10.8, bearing: -35, pitch: 70 },
  'grand-canyon': {
    name: 'Grand Canyon',
    elevation: '2,300 m rim',
    center: [-112.1129, 36.1069],
    zoom: 11.4,
    bearing: 62,
    pitch: 68,
  },
};

@Component({
  selector: 'z-demo-map-block-terrain',
  imports: [ZardMapImports, ZardCardComponent, ZardSliderComponent, ZardSwitchComponent, ZardToggleGroupComponent],
  template: `
    <div class="bg-background relative size-full overflow-hidden">
      <ng-map
        [center]="start.center"
        [zoom]="start.zoom"
        [options]="{ pitch: start.pitch, bearing: start.bearing, maxPitch: 80, scrollZoom: false }"
        (mapReady)="map = $event"
      >
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" [showCompass]="true" />
        <!-- Elevation comes from public Terrarium tiles. Apply it with one element, relief included. -->
        <ng-map-terrain [exaggeration]="exaggeration()" [hillshade]="hillshade()" />
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-72 gap-4 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="px-4">
          <p class="text-sm font-semibold">{{ peak().name }}</p>
          <p class="text-muted-foreground text-xs">{{ peak().elevation }}</p>
        </div>

        <div class="flex flex-col gap-4 px-4">
          <z-toggle-group
            class="flex-wrap"
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="peaks"
            [zDefaultValue]="selected()"
            (valueChange)="onPeakChange($event)"
          />

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between text-sm">
              <label id="terrain-exaggeration" class="font-medium">Exaggeration</label>
              <span class="text-muted-foreground tabular-nums">{{ exaggeration().toFixed(1) }}x</span>
            </div>
            <z-slider
              aria-labelledby="terrain-exaggeration"
              [zValue]="[slider()]"
              (zSlideIndexChange)="setExaggeration($event[0])"
            />
          </div>

          <z-switch [(zChecked)]="hillshade">Hillshade</z-switch>
          <p class="text-muted-foreground hidden text-xs md:block">
            Hold right-click and drag, or Ctrl and drag, to tilt and turn.
          </p>
        </div>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockTerrainComponent {
  protected map: MapLibreMap | null = null;
  protected readonly start = PEAKS.matterhorn;

  protected readonly selected = signal<Peak>('matterhorn');
  protected readonly exaggeration = signal(1.6);
  /** The slider runs from 0 to 100, so a range of values is mapped onto it. */
  protected readonly slider = computed(() => ((this.exaggeration() - 1) / 2) * 100);
  protected readonly hillshade = signal(true);

  protected readonly peaks: ZardToggleGroupItem[] = [
    { value: 'matterhorn', label: 'Matterhorn' },
    { value: 'fuji', label: 'Mount Fuji' },
    { value: 'grand-canyon', label: 'Grand Canyon' },
  ];

  protected readonly peak = computed(() => PEAKS[this.selected()]);

  protected setExaggeration(percent: number): void {
    this.exaggeration.set(Math.round((1 + (percent / 100) * 2) * 10) / 10);
  }

  protected onPeakChange(value: string | string[]): void {
    if (value === 'matterhorn' || value === 'fuji' || value === 'grand-canyon') {
      this.selected.set(value);
      const { center, zoom, bearing, pitch } = PEAKS[value];
      this.map?.flyTo({ center, zoom, bearing, pitch, duration: 4000, essential: true });
    }
  }
}
