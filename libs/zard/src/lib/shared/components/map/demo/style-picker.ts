import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

@Component({
  selector: 'z-demo-map-style-picker',
  imports: [ZardMapImports, ZardMapStyleSelectComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <!-- No [styles] here: this map follows the app-wide basemap that provideZardMap() registers. -->
      <ng-map [center]="[-0.1276, 51.5072]" [zoom]="11.5">
        <ng-map-controls />
        <ng-map-marker [longitude]="-0.1276" [latitude]="51.5072" ariaLabel="London">
          <ng-marker-content />
        </ng-map-marker>
      </ng-map>

      <!-- The picker is plain HTML, so it can sit over a corner of the map, in a toolbar or in your app header. -->
      <z-map-style-select class="absolute top-3 left-3 w-60" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStylePickerComponent {}
