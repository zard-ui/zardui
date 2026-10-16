import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardCardImports } from '@/shared/components/card/card.imports';
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
  imports: [ZardMapImports, ZardCardImports, ZardSliderComponent, ZardSwitchComponent, ZardToggleGroupComponent],
  template: `
    <div class="grid w-full gap-4 lg:grid-cols-4">
      <z-card class="gap-4">
        <z-card-header>
          <z-card-title [zTitle]="peak().name" />
          <z-card-description [zDescription]="peak().elevation" />
        </z-card-header>
        <z-card-content class="flex flex-col gap-5">
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
              [zMin]="1"
              [zMax]="3"
              [zStep]="0.1"
              [zValue]="[exaggeration()]"
              (zSlideIndexChange)="exaggeration.set($event[0])"
            />
          </div>

          <z-switch [(zChecked)]="hillshade">Hillshade</z-switch>
          <p class="text-muted-foreground text-xs">Hold right-click and drag, or Ctrl and drag, to tilt and turn.</p>
        </z-card-content>
      </z-card>

      <div class="h-96 overflow-hidden rounded-xl border lg:col-span-3 lg:h-136">
        <ng-map
          [center]="start.center"
          [zoom]="start.zoom"
          [options]="{ pitch: start.pitch, bearing: start.bearing, maxPitch: 80 }"
          (mapReady)="map = $event"
        >
          <ng-map-controls [showCompass]="true" />
          <!-- Elevation comes from public Terrarium tiles. Apply it with one element, relief included. -->
          <ng-map-terrain [exaggeration]="exaggeration()" [hillshade]="hillshade()" />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockTerrainComponent {
  protected map: MapLibreMap | null = null;
  protected readonly start = PEAKS.matterhorn;

  protected readonly selected = signal<Peak>('matterhorn');
  protected readonly exaggeration = signal(1.6);
  protected readonly hillshade = signal(true);

  protected readonly peaks: ZardToggleGroupItem[] = [
    { value: 'matterhorn', label: 'Matterhorn' },
    { value: 'fuji', label: 'Mount Fuji' },
    { value: 'grand-canyon', label: 'Grand Canyon' },
  ];

  protected readonly peak = computed(() => PEAKS[this.selected()]);

  protected onPeakChange(value: string | string[]): void {
    if (value === 'matterhorn' || value === 'fuji' || value === 'grand-canyon') {
      this.selected.set(value);
      const { center, zoom, bearing, pitch } = PEAKS[value];
      this.map?.flyTo({ center, zoom, bearing, pitch, duration: 4000, essential: true });
    }
  }
}
