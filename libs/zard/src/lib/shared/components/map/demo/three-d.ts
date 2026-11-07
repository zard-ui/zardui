import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type Place = 'manhattan' | 'matterhorn';

const CAMERAS: Record<Place, { center: [number, number]; zoom: number; pitch: number; bearing: number }> = {
  manhattan: { center: [-74.0134, 40.7061], zoom: 15.6, pitch: 62, bearing: -20 },
  matterhorn: { center: [7.6586, 45.9763], zoom: 11.6, pitch: 72, bearing: 25 },
};

/** OpenMapTiles basemaps name their vector source differently from Carto. */
const OPENMAPTILES_SOURCES = ['openmaptiles', 'maptiler_planet'];

@Component({
  selector: 'z-demo-map-three-d',
  imports: [ZardMapImports, ZardToggleGroupComponent, ZardSwitchComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-4">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="places"
          [zDefaultValue]="place()"
          (valueChange)="onPlaceChange($event)"
        />
        <z-switch [(zChecked)]="terrain">Terrain</z-switch>
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map
          [center]="camera.center"
          [zoom]="camera.zoom"
          [options]="{ pitch: camera.pitch, bearing: camera.bearing }"
          (mapReady)="onMapReady($event)"
        >
          <ng-map-controls [showCompass]="true" />
          <!-- Buildings appear from zoom 14, with the heights the basemap carries. -->
          <ng-map-fill-extrusion [source]="buildings()" [sourceLayer]="buildings() ? 'building' : undefined" />
          @if (terrain()) {
            <!-- Elevation from public Terrarium tiles, plus a hillshade so the relief reads. -->
            <ng-map-terrain [exaggeration]="1.5" [hillshade]="true" />
          }
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapThreeDComponent {
  /** The buildings' source when the basemap is OpenMapTiles; Carto is detected on its own. */
  protected readonly buildings = signal<string | undefined>(undefined);
  protected readonly camera = CAMERAS.manhattan;
  protected map: MapLibreMap | null = null;

  protected readonly place = signal<Place>('manhattan');
  protected readonly terrain = signal(true);

  protected readonly places: ZardToggleGroupItem[] = [
    { value: 'manhattan', label: 'Manhattan (buildings)' },
    { value: 'matterhorn', label: 'Matterhorn (terrain)' },
  ];

  protected onMapReady(map: MapLibreMap): void {
    this.map = map;
    const sync = () => this.buildings.set(OPENMAPTILES_SOURCES.find(id => map.getSource(id)));
    sync();
    map.on('styledata', sync);
  }

  protected onPlaceChange(value: string | string[]): void {
    if (typeof value !== 'string' || !value) {
      return;
    }

    this.place.set(value as Place);
    this.map?.flyTo({ ...CAMERAS[value as Place], duration: 3500, essential: true });
  }
}
