import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, type Type } from '@angular/core';

import { MapStateComponent } from '@doc/domain/components/map-state/map-state.component';
import type { MapBlock } from '@doc/domain/config/maps-registry';
import { linkMapLibreStyles } from '@doc/shared/utils/maplibre-styles';
import { supportsWebGL2 } from '@doc/shared/utils/webgl';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { provideZardMap } from '@zard/components/map/map.provider';
import { mergeClasses } from '@zard/utils/merge-classes';

/**
 * A map of the /maps gallery inside the `/create` preview.
 *
 * Maps need what no other item does: ng-mapcn's providers and MapLibre's stylesheet. Both come with this component,
 * which the preview only loads for a `map:` item, so MapLibre (about 1 MB) never reaches the other items. The map
 * follows the preview's tokens like every component, but part of it is not zard's to restyle, and a map is not part
 * of a preset either: the notice above it says so, rather than letting a picker look broken.
 */
@Component({
  selector: 'z-create-map-frame',
  imports: [NgComponentOutlet, MapStateComponent, ZardAlertComponent],
  providers: [provideZardMap()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4 p-4 md:p-6', 'data-slot': 'create-map-frame' },
  template: `
    <z-alert zTitle="Maps keep part of their own look" [zDescription]="notes" data-testid="map-notice" />
    <ng-template #notes>
      <ul class="list-disc space-y-1 ps-4">
        <li>
          Theme colors, radius and Custom colors reach the map's controls, popups and markers. The basemap keeps its own
          palette: change it with the basemap picker, not the theme.
        </li>
        <li>Style, fonts and Icon Library do not apply: the map's controls draw their own icons.</li>
        <li>
          Not part of a preset: create and --preset do not install it. Add it with
          <code class="font-mono">zard-cli add map</code>
          (Angular 22 or newer; MapLibre loads on the route that shows the map).
        </li>
        <li>It needs WebGL2: a browser without it shows a notice instead of the map.</li>
      </ul>
    </ng-template>

    <div [class]="frameClasses()" data-testid="map-frame">
      @if (!supported) {
        <z-map-state class="absolute inset-0 rounded-none border-0" state="unsupported" />
      } @else {
        <ng-container *ngComponentOutlet="component()" />
      }
    </div>
  `,
})
export class CreateMapFrameComponent {
  readonly block = input.required<MapBlock>();
  readonly component = input.required<Type<unknown>>();

  protected readonly supported = supportsWebGL2();

  /** The gallery's fixed height: tiles load into a frame that already has its size. */
  protected readonly frameClasses = computed(() =>
    mergeClasses('bg-background relative w-full overflow-hidden rounded-xl border', this.block().frameClass),
  );

  constructor() {
    linkMapLibreStyles(inject(DOCUMENT));
  }
}
