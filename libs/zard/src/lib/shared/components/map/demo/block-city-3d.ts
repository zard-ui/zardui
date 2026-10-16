import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

import type { MapViewport } from 'ng-mapcn';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZARD_MAP_DEFAULT_STYLES } from '@/shared/components/map/map-styles';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type City = 'new-york' | 'chicago' | 'frankfurt';

const CITIES: Record<City, MapViewport> = {
  'new-york': { center: [-73.9857, 40.7484], zoom: 15.4, bearing: -28, pitch: 62 },
  chicago: { center: [-87.6298, 41.8819], zoom: 15.6, bearing: 20, pitch: 62 },
  frankfurt: { center: [8.6724, 50.1127], zoom: 15.5, bearing: -35, pitch: 62 },
};

@Component({
  selector: 'z-demo-map-block-city-3d',
  imports: [ZardMapImports, ZardCardImports, ZardSliderComponent, ZardSwitchComponent, ZardToggleGroupComponent],
  template: `
    <div class="grid w-full gap-4 lg:grid-cols-4">
      <z-card class="gap-4">
        <z-card-header>
          <z-card-title zTitle="3D city" />
          <z-card-description zDescription="Buildings rise from the basemap, taller means darker" />
        </z-card-header>
        <z-card-content class="flex flex-col gap-5">
          <z-toggle-group
            class="flex-wrap"
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="cities"
            [zDefaultValue]="city()"
            (valueChange)="onCityChange($event)"
          />

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between text-sm">
              <label id="city-pitch" class="font-medium">Tilt</label>
              <span class="text-muted-foreground tabular-nums">{{ viewport().pitch.toFixed(0) }}°</span>
            </div>
            <z-slider
              aria-labelledby="city-pitch"
              [zMin]="0"
              [zMax]="75"
              [zValue]="[viewport().pitch]"
              (zSlideIndexChange)="patch({ pitch: $event[0] })"
            />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between text-sm">
              <label id="city-bearing" class="font-medium">Heading</label>
              <span class="text-muted-foreground tabular-nums">{{ normalized(viewport().bearing).toFixed(0) }}°</span>
            </div>
            <z-slider
              aria-labelledby="city-bearing"
              [zMin]="-180"
              [zMax]="180"
              [zValue]="[normalized(viewport().bearing)]"
              (zSlideIndexChange)="patch({ bearing: $event[0] })"
            />
          </div>

          <z-switch [(zChecked)]="rotating">Rotate</z-switch>
        </z-card-content>
      </z-card>

      <div class="h-96 overflow-hidden rounded-xl border lg:col-span-3 lg:h-136">
        <!-- The extrusions read Carto's building layer: pin Carto so a global preset does not take it away. -->
        <ng-map [styles]="carto" [viewport]="viewport()" (viewportChange)="viewport.set($event)">
          <ng-map-controls [showCompass]="true" />
          <ng-map-fill-extrusion [color]="color" [opacity]="0.9" />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockCity3dComponent {
  protected readonly carto = ZARD_MAP_DEFAULT_STYLES;
  protected readonly viewport = signal<MapViewport>(CITIES['new-york']);
  protected readonly city = signal<City>('new-york');
  protected readonly rotating = signal(false);

  protected readonly cities: ZardToggleGroupItem[] = [
    { value: 'new-york', label: 'New York' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'frankfurt', label: 'Frankfurt' },
  ];

  /** Height in meters to color: low buildings are pale, towers are deep indigo. */
  protected readonly color = [
    'interpolate',
    ['linear'],
    ['coalesce', ['get', 'render_height'], 0],
    0,
    '#c7d2fe',
    60,
    '#818cf8',
    180,
    '#4f46e5',
    350,
    '#312e81',
  ];

  constructor() {
    effect(onCleanup => {
      if (!this.rotating()) {
        return;
      }

      const timer = setInterval(() => this.patch({ bearing: this.viewport().bearing + 0.5 }), 50);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected patch(change: Partial<MapViewport>): void {
    this.viewport.update(current => ({ ...current, ...change }));
  }

  /** The heading wraps around, the slider does not. */
  protected normalized(bearing: number): number {
    return ((((bearing + 180) % 360) + 360) % 360) - 180;
  }

  protected onCityChange(value: string | string[]): void {
    if (value === 'new-york' || value === 'chicago' || value === 'frankfurt') {
      this.city.set(value);
      this.viewport.set(CITIES[value]);
    }
  }
}
