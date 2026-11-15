import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePause, lucidePlay } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

/** Pacific Coast Highway, San Francisco to San Simeon, as [longitude, latitude] pairs. */
const COAST: [number, number][] = [
  [-122.4194, 37.7749],
  [-122.5075, 37.6879],
  [-122.4286, 37.4636],
  [-122.3086, 37.1836],
  [-122.1236, 37.0036],
  [-122.0308, 36.9741],
  [-121.9486, 36.9631],
  [-121.8947, 36.6002],
  [-121.9276, 36.5552],
  [-121.9496, 36.4616],
  [-121.9021, 36.3015],
  [-121.8081, 36.2704],
  [-121.5946, 35.9988],
  [-121.3441, 35.7655],
  [-121.1665, 35.6852],
];

@Component({
  selector: 'z-demo-map-route',
  imports: [ZardMapImports, ZardButtonComponent, ZardSliderComponent, NgIcon],
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[-121.9, 36.45]" [zoom]="7">
          <ng-map-controls />

          <!-- The line is drawn faint; <ng-route-progress> paints the covered part on top. -->
          <ng-map-route [coordinates]="route" [width]="4" [opacity]="0.5" [progress]="progress()">
            <ng-route-progress color="#2563eb" />
            <ng-route-marker at="start"><ng-marker-content /></ng-route-marker>
            <ng-route-marker at="end"><ng-marker-content /></ng-route-marker>
            <ng-route-marker at="progress">
              <ng-marker-content>
                <div class="bg-primary border-background size-4 rounded-full border-2 shadow-lg"></div>
              </ng-marker-content>
            </ng-route-marker>
          </ng-map-route>
        </ng-map>
      </div>

      <div class="flex items-center gap-4">
        <button
          z-button
          zType="outline"
          zSize="icon"
          type="button"
          [attr.aria-label]="playing() ? 'Pause' : 'Play'"
          (click)="toggle()"
        >
          <ng-icon [name]="playing() ? 'lucidePause' : 'lucidePlay'" />
        </button>
        <z-slider
          class="flex-1"
          aria-label="Route progress"
          [zValue]="[progress() * 100]"
          (zSlideIndexChange)="setProgress($event[0] / 100)"
        />
        <span class="text-muted-foreground w-10 text-right text-sm tabular-nums">
          {{ (progress() * 100).toFixed(0) }}%
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePause, lucidePlay })],
})
export class ZardDemoMapRouteComponent {
  private timer: ReturnType<typeof setInterval> | undefined;

  protected readonly route = COAST;
  protected readonly progress = signal(0.35);
  protected readonly playing = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  protected setProgress(value: number): void {
    this.progress.set(Math.min(1, Math.max(0, value)));
  }

  protected toggle(): void {
    if (this.playing()) {
      this.stop();
      return;
    }

    if (this.progress() >= 1) {
      this.progress.set(0);
    }
    this.playing.set(true);
    this.timer = setInterval(() => {
      this.setProgress(this.progress() + 0.004);
      if (this.progress() >= 1) {
        this.stop();
      }
    }, 16);
  }

  private stop(): void {
    clearInterval(this.timer);
    this.timer = undefined;
    this.playing.set(false);
  }
}
