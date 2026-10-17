import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClock, lucidePackage, lucidePhone, lucideTruck } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

/** From the warehouse on the Embarcadero to a door in the Marina, as [longitude, latitude] pairs. */
const ROUTE: [number, number][] = [
  [-122.3993, 37.7897],
  [-122.4035, 37.7915],
  [-122.4081, 37.794],
  [-122.412, 37.7952],
  [-122.4158, 37.7961],
  [-122.4189, 37.7969],
  [-122.4212, 37.7988],
  [-122.4245, 37.8003],
  [-122.429, 37.801],
  [-122.432, 37.8022],
  [-122.4352, 37.8029],
  [-122.4376, 37.8021],
];

const STEPS = [
  { title: 'Order confirmed', at: 0 },
  { title: 'Picked up at the warehouse', at: 0.02 },
  { title: 'On the way', at: 0.1 },
  { title: 'Arriving', at: 0.85 },
  { title: 'Delivered', at: 1 },
];

/** The whole trip takes about this long on the demo clock. */
const TRIP_MS = 45_000;

@Component({
  selector: 'z-demo-map-block-delivery-tracker',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardButtonComponent, ZardProgressComponent, NgIcon],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map [center]="[-122.4185, 37.7965]" [zoom]="13.2" [fitBounds]="fit" [options]="{ scrollZoom: false }">
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <ng-map-route [coordinates]="route" [width]="5" [opacity]="0.35" [progress]="progress()" [interactive]="false">
          <ng-route-progress color="#155dfc" />
          <ng-route-marker at="start">
            <ng-marker-content>
              <div
                class="bg-background text-foreground flex size-8 items-center justify-center rounded-full border shadow-md"
              >
                <ng-icon name="lucidePackage" class="size-4" aria-hidden="true" />
              </div>
            </ng-marker-content>
            <ng-marker-tooltip>Warehouse</ng-marker-tooltip>
          </ng-route-marker>
          <ng-route-marker at="end">
            <ng-marker-content>
              <div class="bg-primary border-background size-4 rounded-full border-2 shadow-md"></div>
            </ng-marker-content>
            <ng-marker-label position="bottom">Delivery address</ng-marker-label>
          </ng-route-marker>
          <ng-route-marker at="progress">
            <ng-marker-content>
              <div
                class="bg-chart-3 border-background flex size-9 items-center justify-center rounded-full border-2 text-white shadow-lg"
              >
                <ng-icon name="lucideTruck" class="size-4" aria-hidden="true" />
              </div>
            </ng-marker-content>
          </ng-route-marker>
        </ng-map-route>
      </ng-map>

      <z-card
        class="bg-card/90 absolute inset-x-3 bottom-3 z-10 gap-3 shadow-sm backdrop-blur-sm @3xl:inset-y-4 @3xl:right-auto @3xl:bottom-auto @3xl:left-4 @3xl:w-96"
      >
        <z-card-header>
          <z-card-title zTitle="Order #48213" />
          <z-card-description zDescription="Two items · Leaves from Embarcadero" />
          <z-card-action>
            <z-badge [zType]="delivered() ? 'secondary' : 'default'">
              {{ delivered() ? 'Delivered' : 'In transit' }}
            </z-badge>
          </z-card-action>
        </z-card-header>

        <z-card-content class="flex flex-col gap-4 @3xl:gap-5">
          <div class="flex flex-col gap-2">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-semibold tabular-nums">{{ eta() }}</span>
              <span class="text-muted-foreground flex items-center gap-1.5 text-sm">
                <ng-icon name="lucideClock" class="size-4" aria-hidden="true" />
                {{ delivered() ? 'Arrived' : 'min to go' }}
              </span>
            </div>
            <z-progress [value]="progress() * 100" class="h-2" />
          </div>

          <ol class="hidden flex-col gap-3 @3xl:flex" aria-label="Delivery progress">
            @for (step of steps; track step.title) {
              <li class="flex items-center gap-3 text-sm" [class.text-muted-foreground]="progress() < step.at">
                <span
                  class="flex size-5 shrink-0 items-center justify-center rounded-full border"
                  [class.bg-primary]="progress() >= step.at"
                  [class.text-primary-foreground]="progress() >= step.at"
                  [class.border-primary]="progress() >= step.at"
                >
                  @if (progress() >= step.at) {
                    <ng-icon name="lucideCheck" class="size-3" aria-hidden="true" />
                  }
                </span>
                {{ step.title }}
              </li>
            }
          </ol>

          <div class="flex items-center gap-3 rounded-lg border p-3">
            <span class="bg-muted flex size-9 items-center justify-center rounded-full text-sm font-medium">MR</span>
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-sm font-medium">Marco Rossi</span>
              <span class="text-muted-foreground text-xs">Your courier · 4.9 rating</span>
            </div>
            <button z-button zType="outline" zSize="icon" type="button" aria-label="Call the courier">
              <ng-icon name="lucidePhone" />
            </button>
          </div>
        </z-card-content>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideClock, lucidePackage, lucidePhone, lucideTruck })],
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockDeliveryTrackerComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly route = ROUTE;

  /** The route is framed to the right of the order card on a wide frame, and above it on a narrow one. */
  protected readonly fit = {
    padding: globalThis.matchMedia?.('(min-width: 816px)').matches
      ? { top: 70, right: 70, bottom: 70, left: 470 }
      : { top: 50, right: 40, bottom: 300, left: 40 },
    maxZoom: 15,
  };

  protected readonly steps = STEPS;
  protected readonly progress = signal(0.12);

  protected readonly delivered = computed(() => this.progress() >= 1);
  protected readonly eta = computed(() =>
    this.delivered() ? 'Now' : Math.max(1, Math.ceil((1 - this.progress()) * 18)),
  );

  constructor() {
    // The courier drives the route on a loop. Browser only, and it stops with the component.
    afterNextRender(() => {
      let last = performance.now();
      let elapsed = this.progress();
      const timer = setInterval(() => {
        const now = performance.now();
        elapsed += (now - last) / TRIP_MS;
        last = now;
        // Linger on "delivered" for a moment, then send the courier out again.
        if (elapsed >= 1.08) {
          elapsed = 0.02;
        }
        this.progress.set(Math.min(elapsed, 1));
      }, 100);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
