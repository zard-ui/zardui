import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { LineLayerSpecification } from 'maplibre-gl';
import type { MapArcDatum, MapArcEvent } from 'ng-mapcn';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

/** MapLibre paints with colors, not CSS variables: the blue is `--chart-2`, and air freight takes an amber. */
const SEA = '#2b7fff';
const AIR = '#f59e0b';

type Mode = 'sea' | 'air';
type Filter = 'all' | Mode;

interface Hub {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface Lane extends MapArcDatum {
  mode: Mode;
  /** Containers (sea) or tonnes (air) per week. */
  volume: number;
  label: string;
}

const HUBS: Record<string, Hub> = {
  rtm: { id: 'rtm', name: 'Rotterdam', coordinates: [4.4777, 51.9244] },
  sha: { id: 'sha', name: 'Shanghai', coordinates: [121.4737, 31.2304] },
  sin: { id: 'sin', name: 'Singapore', coordinates: [103.8198, 1.3521] },
  lax: { id: 'lax', name: 'Los Angeles', coordinates: [-118.2437, 33.7405] },
  ssz: { id: 'ssz', name: 'Santos', coordinates: [-46.3322, -23.9608] },
  dxb: { id: 'dxb', name: 'Jebel Ali', coordinates: [55.0272, 25.0118] },
  nyc: { id: 'nyc', name: 'New York', coordinates: [-74.006, 40.7128] },
};

function lane(from: string, to: string, mode: Mode, volume: number): Lane {
  return {
    id: `${from}-${to}-${mode}`,
    from: HUBS[from].coordinates,
    to: HUBS[to].coordinates,
    mode,
    volume,
    label: `${HUBS[from].name} to ${HUBS[to].name}`,
  };
}

const LANES: Lane[] = [
  lane('sha', 'rtm', 'sea', 940),
  lane('sha', 'lax', 'sea', 820),
  lane('sin', 'rtm', 'sea', 610),
  lane('sin', 'dxb', 'sea', 380),
  lane('dxb', 'rtm', 'sea', 340),
  lane('rtm', 'nyc', 'sea', 420),
  lane('ssz', 'rtm', 'sea', 260),
  lane('sha', 'nyc', 'air', 240),
  lane('lax', 'sha', 'air', 190),
  lane('dxb', 'nyc', 'air', 120),
  lane('rtm', 'sin', 'air', 90),
];

@Component({
  selector: 'z-demo-map-block-logistics-network',
  imports: [ZardMapImports, ZardBadgeComponent, ZardCardComponent, ZardToggleGroupComponent],
  template: `
    <div class="bg-background @container relative size-full overflow-hidden">
      <ng-map [center]="[20, 30]" [zoom]="compact ? 0.2 : 1.4" [options]="mapOptions">
        <ng-map-controls class="[&_.ng-controls]:bottom-2!" />
        <!-- The width of an arc follows its volume: a paint expression reads the datum with ["get", "volume"]. -->
        <ng-map-arc
          [data]="lanes()"
          [curvature]="0.22"
          [paint]="paint"
          [hoverPaint]="{ 'line-opacity': 1 }"
          (arcHover)="onArcHover($event)"
        />
        @for (hub of hubs; track hub.id) {
          <ng-map-marker [longitude]="hub.coordinates[0]" [latitude]="hub.coordinates[1]" [ariaLabel]="hub.name">
            <ng-marker-content>
              <span class="bg-background border-foreground block size-3 rounded-full border-2 shadow-sm"></span>
            </ng-marker-content>
            <ng-marker-tooltip>{{ hub.name }}</ng-marker-tooltip>
          </ng-map-marker>
        }
      </ng-map>

      <z-card
        class="bg-card/90 absolute inset-x-3 bottom-3 z-10 h-72 gap-0 py-0 shadow-sm backdrop-blur-sm @3xl:inset-y-4 @3xl:right-auto @3xl:left-4 @3xl:h-auto @3xl:w-80"
      >
        <div class="flex flex-col gap-3 border-b p-3">
          <div>
            <p class="text-sm font-semibold">Freight network</p>
            <p class="text-muted-foreground text-xs">Weekly volume between the main hubs</p>
          </div>
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="sm"
            [zItems]="filters"
            [zDefaultValue]="filter()"
            (valueChange)="onFilterChange($event)"
          />
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-background/60 rounded-md border p-2">
              <p class="text-muted-foreground text-[10px] tracking-wide uppercase">Lanes</p>
              <p class="text-sm font-semibold tabular-nums">{{ lanes().length }}</p>
            </div>
            <div class="bg-background/60 rounded-md border p-2">
              <p class="text-muted-foreground text-[10px] tracking-wide uppercase">Weekly volume</p>
              <p class="text-sm font-semibold tabular-nums">{{ total().toLocaleString('en-US') }}</p>
            </div>
          </div>
        </div>

        <ul class="min-h-0 flex-1 divide-y overflow-y-auto" aria-label="Lanes by weekly volume">
          @for (item of ranked(); track item.id) {
            <li
              class="flex flex-col gap-1.5 px-3 py-2 transition-colors"
              [class.bg-accent]="hovered() === item.id"
              (mouseenter)="hovered.set(item.id)"
              (mouseleave)="hovered.set(null)"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="truncate text-xs font-medium">{{ item.label }}</span>
                <z-badge [zType]="item.mode === 'sea' ? 'secondary' : 'outline'" class="shrink-0">
                  {{ item.mode === 'sea' ? 'Sea' : 'Air' }}
                </z-badge>
              </div>
              <div class="flex items-center gap-2">
                <div class="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                  <div
                    class="h-full rounded-full"
                    [style.width.%]="(item.volume / max) * 100"
                    [style.background-color]="item.mode === 'sea' ? SEA : AIR"
                  ></div>
                </div>
                <span class="text-muted-foreground w-9 text-right text-xs tabular-nums">{{ item.volume }}</span>
              </div>
            </li>
          }
        </ul>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block size-full' },
})
export class ZardDemoMapBlockLogisticsNetworkComponent {
  /** A phone shows the whole world small; a wide frame zooms in. */
  protected readonly compact = !globalThis.matchMedia?.('(min-width: 816px)').matches;
  /**
   * The camera is padded by the panel over the map, so the world is centered in what is left of the frame: the panel
   * is on the left of a wide frame, and at the bottom of a narrow one.
   */
  protected readonly mapOptions = {
    scrollZoom: false,
    dragRotate: false,
    padding: globalThis.matchMedia?.('(min-width: 816px)').matches
      ? { left: 340, top: 16, bottom: 16, right: 16 }
      : { bottom: 300, top: 16, left: 16, right: 16 },
  };

  protected readonly SEA = SEA;
  protected readonly AIR = AIR;
  protected readonly max = Math.max(...LANES.map(item => item.volume));
  protected readonly hubs = Object.values(HUBS);
  protected readonly filter = signal<Filter>('all');
  protected readonly hovered = signal<string | number | null>(null);

  protected readonly filters: ZardToggleGroupItem[] = [
    { value: 'all', label: 'All' },
    { value: 'sea', label: 'Sea' },
    { value: 'air', label: 'Air' },
  ];

  /** A new array only when the filter changes, so the map pushes new data only then. */
  protected readonly lanes = computed(() =>
    LANES.filter(item => this.filter() === 'all' || item.mode === this.filter()),
  );

  protected readonly total = computed(() => this.lanes().reduce((sum, item) => sum + item.volume, 0));
  protected readonly ranked = computed(() => [...this.lanes()].sort((a, b) => b.volume - a.volume));

  protected readonly paint: LineLayerSpecification['paint'] = {
    'line-color': ['match', ['get', 'mode'], 'air', AIR, SEA],
    'line-width': ['interpolate', ['linear'], ['get', 'volume'], 80, 1.5, 950, 6],
    'line-opacity': 0.75,
  };

  protected onFilterChange(value: string | string[]): void {
    if (value === 'all' || value === 'sea' || value === 'air') {
      this.filter.set(value);
    }
  }

  protected onArcHover(event: MapArcEvent<Lane> | null): void {
    this.hovered.set(event?.arc.id ?? null);
  }
}
