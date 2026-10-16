import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-popup',
  imports: [ZardMapImports, ZardButtonComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[-0.1278, 51.5074]" [zoom]="12">
        <ng-map-controls />

        <!-- No marker needed: a popup can sit at any coordinate. [(open)] keeps your state in sync. -->
        <ng-map-popup
          [longitude]="-0.1195"
          [latitude]="51.5033"
          [closeButton]="true"
          [closeOnClick]="false"
          [(open)]="open"
        >
          <div class="flex flex-col gap-1 pr-4">
            <p class="font-medium">London Eye</p>
            <p class="text-muted-foreground text-xs">135 m tall, on the south bank of the Thames.</p>
          </div>
        </ng-map-popup>
      </ng-map>

      <button z-button zType="secondary" zSize="sm" class="absolute top-3 left-3" (click)="open.set(!open())">
        {{ open() ? 'Close popup' : 'Open popup' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapPopupComponent {
  protected readonly open = signal(true);
}
