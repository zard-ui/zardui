import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardTableImports } from '@/shared/components/table/table.imports';

type Status = 'up' | 'degraded' | 'down';

interface Probe {
  id: string;
  city: string;
  lng: number;
  lat: number;
  latency: number;
  status: Status;
}

const STATUS_STYLES: Record<Status, { label: string; dot: string; badge: 'secondary' | 'outline' | 'destructive' }> = {
  up: { label: 'Operational', dot: 'bg-emerald-500', badge: 'secondary' },
  degraded: { label: 'Degraded', dot: 'bg-amber-500', badge: 'outline' },
  down: { label: 'Down', dot: 'bg-red-500', badge: 'destructive' },
};

const PROBES: Probe[] = [
  { id: 'iad', city: 'Washington', lng: -77.04, lat: 38.9, latency: 42, status: 'up' },
  { id: 'sfo', city: 'San Francisco', lng: -122.42, lat: 37.77, latency: 58, status: 'up' },
  { id: 'gru', city: 'São Paulo', lng: -46.63, lat: -23.55, latency: 214, status: 'degraded' },
  { id: 'lhr', city: 'London', lng: -0.13, lat: 51.51, latency: 31, status: 'up' },
  { id: 'fra', city: 'Frankfurt', lng: 8.68, lat: 50.11, latency: 36, status: 'up' },
  { id: 'bom', city: 'Mumbai', lng: 72.88, lat: 19.08, latency: 0, status: 'down' },
  { id: 'sin', city: 'Singapore', lng: 103.82, lat: 1.35, latency: 77, status: 'up' },
  { id: 'syd', city: 'Sydney', lng: 151.21, lat: -33.87, latency: 96, status: 'up' },
];

@Component({
  selector: 'z-demo-map-block-uptime-monitor',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardTableImports],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Global uptime" />
        <z-card-description zDescription="Probes check api.example.com every few seconds" />
        <z-card-action>
          <z-badge [zType]="summary().badge">{{ summary().label }}</z-badge>
        </z-card-action>
      </z-card-header>

      <z-card-content class="grid gap-6 lg:grid-cols-5">
        <div class="relative h-80 overflow-hidden rounded-lg border lg:col-span-3 lg:h-104">
          <ng-map [center]="[15, 22]" [zoom]="1.45" (mapReady)="map = $event">
            <ng-map-controls />
            @for (probe of probes(); track probe.id) {
              <ng-map-marker
                [longitude]="probe.lng"
                [latitude]="probe.lat"
                [ariaLabel]="probe.city + ': ' + label(probe)"
              >
                <ng-marker-content>
                  <span class="relative flex size-4">
                    @if (probe.status !== 'up') {
                      <span
                        class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
                        [class]="styles[probe.status].dot"
                      ></span>
                    }
                    <span
                      class="border-background relative inline-flex size-4 rounded-full border-2 shadow-sm"
                      [class]="styles[probe.status].dot"
                    ></span>
                  </span>
                </ng-marker-content>
                <ng-marker-tooltip>{{ probe.city }} · {{ label(probe) }}</ng-marker-tooltip>
              </ng-map-marker>
            }
          </ng-map>
        </div>

        <div class="lg:col-span-2">
          <table z-table>
            <caption z-table-caption class="sr-only">Status and latency of every probe</caption>
            <thead z-table-header>
              <tr z-table-row>
                <th z-table-head scope="col">Probe</th>
                <th z-table-head scope="col">Status</th>
                <th z-table-head scope="col" class="text-right">Latency</th>
              </tr>
            </thead>
            <tbody z-table-body>
              @for (probe of probes(); track probe.id) {
                <tr
                  z-table-row
                  class="cursor-pointer"
                  tabindex="0"
                  (click)="focusOn(probe)"
                  (keydown.enter)="focusOn(probe)"
                >
                  <td z-table-cell class="font-medium">{{ probe.city }}</td>
                  <td z-table-cell>
                    <span class="flex items-center gap-2">
                      <span class="size-2 rounded-full" [class]="styles[probe.status].dot" aria-hidden="true"></span>
                      {{ styles[probe.status].label }}
                    </span>
                  </td>
                  <td z-table-cell class="text-right tabular-nums">
                    {{ probe.status === 'down' ? '-' : probe.latency + ' ms' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapBlockUptimeMonitorComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected map: MapLibreMap | null = null;
  protected readonly styles = STATUS_STYLES;
  protected readonly probes = signal<Probe[]>(PROBES);

  protected readonly summary = computed(() => {
    const probes = this.probes();
    const down = probes.filter(probe => probe.status === 'down').length;
    const degraded = probes.filter(probe => probe.status === 'degraded').length;

    if (down) {
      return { label: `${down} down`, badge: 'destructive' as const };
    }
    if (degraded) {
      return { label: `${degraded} degraded`, badge: 'outline' as const };
    }
    return { label: 'All systems operational', badge: 'secondary' as const };
  });

  constructor() {
    // Latencies drift a little every few seconds, like a real monitor. Browser only.
    afterNextRender(() => {
      const timer = setInterval(() => {
        this.probes.update(probes =>
          probes.map(probe =>
            probe.status === 'down'
              ? probe
              : { ...probe, latency: Math.max(8, Math.round(probe.latency + (Math.random() - 0.5) * 12)) },
          ),
        );
      }, 3000);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected label(probe: Probe): string {
    return probe.status === 'down' ? 'Down' : `${STATUS_STYLES[probe.status].label}, ${probe.latency} ms`;
  }

  protected focusOn(probe: Probe): void {
    this.map?.flyTo({ center: [probe.lng, probe.lat], zoom: 4, duration: 1400, essential: true });
  }
}
