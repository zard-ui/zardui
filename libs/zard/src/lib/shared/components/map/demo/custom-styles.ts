import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { StyleSpecification } from 'maplibre-gl';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson';

/** A MapLibre style is plain JSON: sources say where the data is, layers say how to draw it. */
function blueprint(colors: { sea: string; land: string; line: string }): StyleSpecification {
  return {
    version: 8,
    sources: { countries: { type: 'geojson', data: COUNTRIES, attribution: 'Natural Earth' } },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': colors.sea } },
      { id: 'land', type: 'fill', source: 'countries', paint: { 'fill-color': colors.land } },
      {
        id: 'borders',
        type: 'line',
        source: 'countries',
        paint: { 'line-color': colors.line, 'line-width': 0.8, 'line-dasharray': [2, 1] },
      },
    ],
  };
}

/** Define styles once, outside the component: `<ng-map>` compares them by identity before it restyles. */
const BLUEPRINT = {
  light: blueprint({ sea: '#eff6ff', land: '#bfdbfe', line: '#2563eb' }),
  dark: blueprint({ sea: '#0b1220', land: '#14213d', line: '#3b82f6' }),
};

const LIBERTY = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};

@Component({
  selector: 'z-demo-map-custom-styles',
  imports: [ZardMapImports, ZardToggleGroupComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        [zItems]="options"
        [zDefaultValue]="choice()"
        (valueChange)="onChoiceChange($event)"
      />

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <!-- Light and dark are separate styles: the map picks one from the theme and swaps live. -->
        <ng-map [styles]="styles()" [center]="[12, 38]" [zoom]="2.4">
          <ng-map-controls />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapCustomStylesComponent {
  protected readonly choice = signal<'liberty' | 'blueprint'>('blueprint');
  protected readonly styles = computed(() => (this.choice() === 'blueprint' ? BLUEPRINT : LIBERTY));

  protected readonly options: ZardToggleGroupItem[] = [
    { value: 'blueprint', label: 'Blueprint (style JSON)' },
    { value: 'liberty', label: 'Liberty (style URL)' },
  ];

  protected onChoiceChange(value: string | string[]): void {
    if (value === 'blueprint' || value === 'liberty') {
      this.choice.set(value);
    }
  }
}
