import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-preview',
  imports: [ZardMapImports],
  template: `
    <div class="h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[-46.6333, -23.5505]" [zoom]="11">
        <ng-map-controls />
        <ng-map-marker [longitude]="-46.6333" [latitude]="-23.5505">
          <ng-marker-content />
          <ng-marker-tooltip>Praça da Sé</ng-marker-tooltip>
          <ng-marker-popup>
            <p class="font-medium">São Paulo</p>
            <p class="text-muted-foreground">The largest city in Brazil.</p>
          </ng-marker-popup>
        </ng-map-marker>
      </ng-map>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapPreviewComponent {}
