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
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

/*
 * After the uptime monitor of ng-mapcn (MIT): a status-page style map of edge locations, with the list of locations
 * floating over it. The countries are drawn from GeoJSON on a blank basemap, so the status colors stand out.
 */

type Status = 'up' | 'degraded' | 'down';

interface Probe {
  id: string;
  city: string;
  region: string;
  lng: number;
  lat: number;
  latency: number;
  uptime: number;
  status: Status;
}

const STATUS_STYLES: Record<Status, { label: string; dot: string; text: string }> = {
  up: { label: 'All systems operational', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  degraded: { label: 'Partial degradation', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  down: { label: 'Major outage', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
};

const PROBES: Probe[] = [
  {
    id: 'iad',
    city: 'Washington',
    region: 'US East',
    lng: -77.04,
    lat: 38.9,
    latency: 42,
    uptime: 99.99,
    status: 'up',
  },
  {
    id: 'sfo',
    city: 'San Francisco',
    region: 'US West',
    lng: -122.42,
    lat: 37.77,
    latency: 58,
    uptime: 99.98,
    status: 'up',
  },
  {
    id: 'gru',
    city: 'São Paulo',
    region: 'South America',
    lng: -46.63,
    lat: -23.55,
    latency: 214,
    uptime: 99.12,
    status: 'degraded',
  },
  {
    id: 'lhr',
    city: 'London',
    region: 'Europe West',
    lng: -0.13,
    lat: 51.51,
    latency: 31,
    uptime: 99.99,
    status: 'up',
  },
  {
    id: 'fra',
    city: 'Frankfurt',
    region: 'Europe Central',
    lng: 8.68,
    lat: 50.11,
    latency: 36,
    uptime: 99.97,
    status: 'up',
  },
  { id: 'bom', city: 'Mumbai', region: 'India', lng: 72.88, lat: 19.08, latency: 0, uptime: 97.4, status: 'down' },
  {
    id: 'sin',
    city: 'Singapore',
    region: 'Asia Pacific',
    lng: 103.82,
    lat: 1.35,
    latency: 77,
    uptime: 99.95,
    status: 'up',
  },
  { id: 'syd', city: 'Sydney', region: 'Oceania', lng: 151.21, lat: -33.87, latency: 96, uptime: 99.9, status: 'up' },
];

/** Natural Earth countries (public domain). Swap in your own GeoJSON to change the regions. */
const COUNTRIES =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson';

@Component({
  selector: 'z-demo-map-block-uptime-monitor',
  imports: [ZardMapImports, ZardBadgeComponent, ZardCardComponent],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map
        [blank]="true"
        [center]="[10, 22]"
        [zoom]="compact ? 0.1 : 1.5"
        [options]="mapOptions"
        (mapReady)="map = $event"
      >
        <ng-map-geojson [data]="countries" [linePaint]="false" />
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        @for (probe of probes(); track probe.id) {
          <ng-map-marker [longitude]="probe.lng" [latitude]="probe.lat" [ariaLabel]="probe.city + ': ' + label(probe)">
            <ng-marker-content>
              <span class="relative flex size-5 items-center justify-center">
                @if (probe.status !== 'up') {
                  <span
                    class="absolute inline-flex size-full animate-ping rounded-full opacity-50"
                    [class]="styles[probe.status].dot"
                  ></span>
                }
                <span
                  class="border-background relative inline-flex size-3.5 rounded-full border-2 shadow-sm"
                  [class]="styles[probe.status].dot"
                ></span>
              </span>
            </ng-marker-content>
            <ng-marker-tooltip>{{ probe.city }} · {{ label(probe) }}</ng-marker-tooltip>
          </ng-map-marker>
        }
      </ng-map>

      <z-card
        class="bg-card/90 absolute inset-x-3 bottom-3 z-10 h-60 gap-0 py-0 shadow-sm backdrop-blur-sm @3xl:inset-y-4 @3xl:right-auto @3xl:left-4 @3xl:h-auto @3xl:w-72"
      >
        <div class="border-b p-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-semibold">Edge network</p>
            <z-badge zType="outline" class="gap-1.5">
              <span class="size-1.5 rounded-full" [class]="styles[summary().status].dot"></span>
              <span class="sr-only">Status:</span>
              {{ summary().short }}
            </z-badge>
          </div>
          <p class="mt-1 text-xs" [class]="styles[summary().status].text">{{ styles[summary().status].label }}</p>

          <div class="mt-3 grid grid-cols-2 gap-2">
            <div class="bg-background/60 rounded-md border p-2">
              <p class="text-muted-foreground text-[10px] tracking-wide uppercase">Uptime</p>
              <p class="text-sm font-semibold tabular-nums">{{ summary().uptime }}%</p>
            </div>
            <div class="bg-background/60 rounded-md border p-2">
              <p class="text-muted-foreground text-[10px] tracking-wide uppercase">Edges up</p>
              <p class="text-sm font-semibold tabular-nums">
                {{ summary().operational }}
                <span class="text-muted-foreground font-normal">/{{ probes().length }}</span>
              </p>
            </div>
          </div>
        </div>

        <ul class="min-h-0 flex-1 divide-y overflow-y-auto" aria-label="Edge locations">
          @for (probe of probes(); track probe.id) {
            <li>
              <button
                type="button"
                class="hover:bg-accent focus-visible:ring-ring flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                (click)="focusOn(probe)"
              >
                <span class="size-2 shrink-0 rounded-full" [class]="styles[probe.status].dot" aria-hidden="true"></span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-medium">{{ probe.city }}</span>
                  <span class="text-muted-foreground block truncate text-[10px]">{{ probe.region }}</span>
                </span>
                <span class="flex shrink-0 flex-col items-end">
                  <span class="text-muted-foreground font-mono text-[10px] uppercase">{{ probe.id }}</span>
                  <span class="font-mono text-[10px] tabular-nums">
                    {{ probe.status === 'down' ? '-' : probe.latency + 'ms' }}
                  </span>
                </span>
              </button>
            </li>
          }
        </ul>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockUptimeMonitorComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  private readonly destroyRef = inject(DestroyRef);

  /**
   * The camera is padded by the panel over the map, so the world is centered in what is left of the frame: the panel
   * is on the left of a wide frame, and at the bottom of a narrow one.
   */
  private readonly padding = globalThis.matchMedia?.('(min-width: 816px)').matches
    ? { left: 310, top: 16, bottom: 16, right: 16 }
    : { bottom: 252, top: 16, left: 16, right: 16 };

  protected map: MapLibreMap | null = null;
  protected readonly countries = COUNTRIES;
  protected readonly styles = STATUS_STYLES;
  protected readonly probes = signal<Probe[]>(PROBES);

  protected readonly mapOptions = {
    minZoom: 0,
    maxZoom: 6,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    padding: this.padding,
  };

  protected readonly summary = computed(() => {
    const probes = this.probes();
    const down = probes.filter(probe => probe.status === 'down').length;
    const degraded = probes.filter(probe => probe.status === 'degraded').length;
    const uptime = probes.reduce((sum, probe) => sum + probe.uptime, 0) / probes.length;

    return {
      status: (down ? 'down' : degraded ? 'degraded' : 'up') as Status,
      short: down ? `${down} down` : degraded ? `${degraded} degraded` : 'Operational',
      operational: probes.filter(probe => probe.status === 'up').length,
      uptime: uptime.toFixed(2),
    };
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
    return probe.status === 'down' ? 'Down' : `${probe.latency} ms · ${probe.uptime}% uptime`;
  }

  protected focusOn(probe: Probe): void {
    this.map?.flyTo({ center: [probe.lng, probe.lat], zoom: 4, duration: 1400, essential: true });
  }
}
