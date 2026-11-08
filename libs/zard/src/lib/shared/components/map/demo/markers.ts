import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { provideIcons, NgIcon } from '@ng-icons/core';
import { lucideCoffee, lucideLandmark, lucideMapPin } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

@Component({
  selector: 'z-demo-map-markers',
  imports: [ZardMapImports, NgIcon, ZardBadgeComponent],
  template: `
    <div class="relative h-[420px] w-full overflow-hidden rounded-xl border">
      <ng-map [center]="[-9.1393, 38.7223]" [zoom]="13">
        <ng-map-controls />

        <!-- Default dot. The tooltip shows on hover and on keyboard focus. -->
        <ng-map-marker [longitude]="-9.1333" [latitude]="38.7139" ariaLabel="Alfama">
          <ng-marker-content />
          <ng-marker-tooltip>Alfama</ng-marker-tooltip>
        </ng-map-marker>

        <!-- Custom content and a label under it. -->
        <ng-map-marker [longitude]="-9.1459" [latitude]="38.7103" ariaLabel="Café A Brasileira">
          <ng-marker-content>
            <div
              class="bg-primary text-primary-foreground border-background flex size-9 items-center justify-center rounded-full border-2 shadow-lg"
            >
              <ng-icon name="lucideCoffee" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-label position="bottom">A Brasileira</ng-marker-label>
        </ng-map-marker>

        <!-- A popup opens on click. Its content is plain HTML, so zard components fit right in. -->
        <ng-map-marker [longitude]="-9.1598" [latitude]="38.6916" ariaLabel="Torre de Belém">
          <ng-marker-content>
            <div
              class="bg-background text-foreground flex size-9 items-center justify-center rounded-full border shadow-lg"
            >
              <ng-icon name="lucideLandmark" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-popup [closeButton]="true">
            <div class="flex flex-col gap-1.5 pr-4">
              <p class="font-medium">Torre de Belém</p>
              <p class="text-muted-foreground text-xs">A 16th century fortress on the Tagus river.</p>
              <z-badge zType="secondary">UNESCO World Heritage</z-badge>
            </div>
          </ng-marker-popup>
        </ng-map-marker>

        <!-- Drag it, or focus it and use the arrow keys. -->
        <ng-map-marker
          [longitude]="position().lng"
          [latitude]="position().lat"
          [draggable]="true"
          ariaLabel="Draggable marker"
          (dragEnd)="position.set($event)"
        >
          <ng-marker-content>
            <div
              class="bg-destructive border-background flex size-9 cursor-grab items-center justify-center rounded-full border-2 text-white shadow-lg"
            >
              <ng-icon name="lucideMapPin" class="size-4" aria-hidden="true" />
            </div>
          </ng-marker-content>
          <ng-marker-tooltip>Drag me</ng-marker-tooltip>
        </ng-map-marker>
      </ng-map>

      <z-badge zType="secondary" class="absolute top-3 left-3 font-mono">
        {{ position().lng.toFixed(4) }}, {{ position().lat.toFixed(4) }}
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCoffee, lucideLandmark, lucideMapPin })],
})
export class ZardDemoMapMarkersComponent {
  protected readonly position = signal({ lng: -9.1393, lat: 38.7223 });
}
