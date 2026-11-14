import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-basic',
  imports: [ZardMapImports],
  template: `
    <div class="h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[2.3522, 48.8566]" [zoom]="11" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBasicComponent {}
