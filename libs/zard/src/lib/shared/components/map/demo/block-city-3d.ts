import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

import type { MapViewport } from 'ng-mapcn';

import { ZardCardComponent } from '@/shared/components/card/card.component';
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
  imports: [ZardMapImports, ZardCardComponent, ZardSliderComponent, ZardSwitchComponent, ZardToggleGroupComponent],
  template: `
    <div class="bg-background relative size-full overflow-hidden">
      <!-- The extrusions read Carto's building layer: pin Carto so a global preset does not take it away. -->
      <ng-map
        [styles]="carto"
        [viewport]="viewport()"
        [options]="{ scrollZoom: false }"
        (viewportChange)="viewport.set($event)"
      >
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" [showCompass]="true" />
        <ng-map-fill-extrusion [color]="color" [opacity]="0.9" />
      </ng-map>

      <z-card
        class="bg-card/90 absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] max-w-72 gap-4 shadow-sm backdrop-blur-sm md:top-5 md:left-5"
      >
        <div class="px-4">
          <p class="text-sm font-semibold">3D city</p>
          <p class="text-muted-foreground text-xs">Buildings rise from the basemap, taller means darker</p>
        </div>

        <div class="flex flex-col gap-4 px-4">
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
              [zValue]="[(viewport().pitch / MAX_PITCH) * 100]"
              (zSlideIndexChange)="patch({ pitch: ($event[0] / 100) * MAX_PITCH })"
            />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between text-sm">
              <label id="city-bearing" class="font-medium">Heading</label>
              <span class="text-muted-foreground tabular-nums">{{ normalized(viewport().bearing).toFixed(0) }}°</span>
            </div>
            <z-slider
              aria-labelledby="city-bearing"
              [zValue]="[((normalized(viewport().bearing) + 180) / 360) * 100]"
              (zSlideIndexChange)="patch({ bearing: ($event[0] / 100) * 360 - 180 })"
            />
          </div>

          <z-switch [(zChecked)]="rotating">Rotate</z-switch>
        </div>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockCity3dComponent {
  /** The sliders run from 0 to 100, so the tilt and the heading are mapped onto them. */
  protected readonly MAX_PITCH = 75;

  protected readonly carto = ZARD_MAP_DEFAULT_STYLES;
  protected readonly viewport = signal<MapViewport>(CITIES['new-york']);
  protected readonly city = signal<City>('new-york');
  protected readonly rotating = signal(false);

  protected readonly cities: ZardToggleGroupItem[] = [
    { value: 'new-york', label: 'New York' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'frankfurt', label: 'Frankfurt' },
  ];

  /**
   * Height in meters to color: low buildings are pale, towers are deep blue. MapLibre paints with colors, not CSS
   * variables, so these are the blues of the `--chart-*` tokens.
   */
  protected readonly color = [
    'interpolate',
    ['linear'],
    ['coalesce', ['get', 'render_height'], 0],
    0,
    '#bedbff',
    60,
    '#51a2ff',
    180,
    '#155dfc',
    350,
    '#1c398e',
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
