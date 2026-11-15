import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type TileSource = 'satellite' | 'topo' | 'buildings';

@Component({
  selector: 'z-demo-map-tile-sources',
  imports: [ZardMapImports, ZardToggleGroupComponent, ZardSliderComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-4">
        <z-toggle-group
          zMode="single"
          zType="outline"
          zSize="sm"
          [zItems]="sources"
          [zDefaultValue]="source()"
          (valueChange)="onSourceChange($event)"
        />
        @if (source() !== 'buildings') {
          <z-slider
            class="w-40"
            aria-label="Layer opacity"
            [zValue]="[opacity() * 100]"
            (zSlideIndexChange)="opacity.set($event[0] / 100)"
          />
        }
      </div>

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-74.0134, 40.7061]" [zoom]="14.2" [options]="{ pitch: 50, bearing: -17 }">
          <ng-map-controls />

          <!-- Raster tiles: XYZ URL templates, drawn above the basemap. -->
          @switch (source()) {
            @case ('satellite') {
              <ng-map-raster-source
                id="imagery"
                [tiles]="[
                  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                ]"
                [tileSize]="256"
                [maxzoom]="19"
                attribution="Tiles © Esri"
                [opacity]="opacity()"
              />
            }
            @case ('topo') {
              <ng-map-raster-source
                id="topo"
                [tiles]="[
                  'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
                  'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
                  'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
                ]"
                [tileSize]="256"
                [maxzoom]="17"
                attribution="© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)"
                [opacity]="opacity()"
              />
            }
            @case ('buildings') {
              <!-- Vector tiles: the source only adds the data. A layer decides how to draw it. -->
              <ng-map-vector-source
                id="openfreemap"
                url="https://tiles.openfreemap.org/planet"
                attribution="© OpenFreeMap © OpenMapTiles"
              />
              <ng-map-fill-extrusion
                source="openfreemap"
                sourceLayer="building"
                heightProperty="render_height"
                baseProperty="render_min_height"
                color="#6366f1"
                [opacity]="0.75"
                [minZoom]="13"
              />
            }
          }
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapTileSourcesComponent {
  protected readonly source = signal<TileSource>('satellite');
  protected readonly opacity = signal(0.85);

  protected readonly sources: ZardToggleGroupItem[] = [
    { value: 'satellite', label: 'Satellite (raster)' },
    { value: 'topo', label: 'Topographic (raster)' },
    { value: 'buildings', label: 'Buildings (vector)' },
  ];

  protected onSourceChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.source.set(value as TileSource);
    }
  }
}
