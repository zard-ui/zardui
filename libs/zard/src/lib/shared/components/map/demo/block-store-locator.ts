import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideSearch } from '@ng-icons/lucide';
import type { Map as MapLibreMap } from 'maplibre-gl';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';

interface Store {
  id: number;
  name: string;
  address: string;
  lng: number;
  lat: number;
  open: boolean;
  hours: string;
}

const STORES: Store[] = [
  {
    id: 1,
    name: 'Mitte Flagship',
    address: 'Rosenthaler Str. 40',
    lng: 13.4015,
    lat: 52.5256,
    open: true,
    hours: 'Open until 21:00',
  },
  {
    id: 2,
    name: 'Kreuzberg Studio',
    address: 'Oranienstr. 25',
    lng: 13.4172,
    lat: 52.5027,
    open: true,
    hours: 'Open until 20:00',
  },
  {
    id: 3,
    name: 'Prenzlauer Berg',
    address: 'Kastanienallee 12',
    lng: 13.4112,
    lat: 52.5411,
    open: false,
    hours: 'Opens at 10:00',
  },
  {
    id: 4,
    name: 'Charlottenburg',
    address: 'Kantstr. 87',
    lng: 13.3036,
    lat: 52.5058,
    open: true,
    hours: 'Open until 19:00',
  },
  {
    id: 5,
    name: 'Friedrichshain',
    address: 'Boxhagener Str. 60',
    lng: 13.4639,
    lat: 52.5107,
    open: true,
    hours: 'Open until 22:00',
  },
  {
    id: 6,
    name: 'Neukölln Outlet',
    address: 'Karl-Marx-Str. 120',
    lng: 13.4386,
    lat: 52.4814,
    open: false,
    hours: 'Opens at 11:00',
  },
  {
    id: 7,
    name: 'Tempelhof',
    address: 'Tempelhofer Damm 1',
    lng: 13.3856,
    lat: 52.4738,
    open: true,
    hours: 'Open until 20:00',
  },
  {
    id: 8,
    name: 'Alexanderplatz',
    address: 'Alexanderstr. 1',
    lng: 13.4132,
    lat: 52.5219,
    open: true,
    hours: 'Open until 22:00',
  },
];

const HOME: [number, number] = [13.405, 52.52];

@Component({
  selector: 'z-demo-map-block-store-locator',
  imports: [ZardMapImports, ZardCardImports, ZardBadgeComponent, ZardInputComponent, NgIcon],
  template: `
    <div class="grid w-full gap-4 lg:grid-cols-3">
      <z-card class="gap-3 lg:h-136">
        <z-card-header>
          <z-card-title zTitle="Find a store" />
          <z-card-description zDescription="{{ results().length }} stores in Berlin" />
        </z-card-header>
        <z-card-content class="flex min-h-0 flex-1 flex-col gap-3">
          <label class="relative block">
            <span class="sr-only">Search stores</span>
            <ng-icon
              name="lucideSearch"
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              z-input
              type="search"
              placeholder="Search by name or street"
              class="pl-8"
              (input)="onSearch($event)"
            />
          </label>

          <ul class="-mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1" aria-label="Stores">
            @for (store of results(); track store.id) {
              <li>
                <button
                  type="button"
                  class="hover:bg-muted focus-visible:ring-ring flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  [class.bg-muted]="selected()?.id === store.id"
                  [attr.aria-pressed]="selected()?.id === store.id"
                  (click)="select(store)"
                >
                  <span class="flex items-center justify-between gap-2">
                    <span class="text-sm font-medium">{{ store.name }}</span>
                    <z-badge [zType]="store.open ? 'secondary' : 'outline'">
                      {{ store.open ? 'Open' : 'Closed' }}
                    </z-badge>
                  </span>
                  <span class="text-muted-foreground text-xs">
                    {{ store.address }} · {{ distance(store) }} km from the center
                  </span>
                  <span class="text-muted-foreground text-xs">{{ store.hours }}</span>
                </button>
              </li>
            } @empty {
              <li class="text-muted-foreground py-8 text-center text-sm">No store matches your search.</li>
            }
          </ul>
        </z-card-content>
      </z-card>

      <div class="relative h-96 overflow-hidden rounded-xl border lg:col-span-2 lg:h-136">
        <ng-map [center]="home" [zoom]="11.2" (mapReady)="map = $event">
          <ng-map-controls />
          @for (store of results(); track store.id) {
            <ng-map-marker
              [longitude]="store.lng"
              [latitude]="store.lat"
              [ariaLabel]="store.name"
              (markerClick)="select(store)"
            >
              <ng-marker-content>
                <div
                  class="border-background flex size-8 items-center justify-center rounded-full border-2 shadow-md transition-transform"
                  [class]="
                    selected()?.id === store.id
                      ? 'bg-primary text-primary-foreground scale-110'
                      : 'bg-background text-foreground'
                  "
                >
                  <ng-icon name="lucideMapPin" class="size-4" aria-hidden="true" />
                </div>
              </ng-marker-content>
            </ng-map-marker>
          }
          @if (selected(); as store) {
            <ng-map-popup
              [longitude]="store.lng"
              [latitude]="store.lat"
              [offset]="28"
              [closeButton]="true"
              [closeOnClick]="false"
              (popupClose)="selected.set(null)"
            >
              <div class="flex flex-col gap-1 pr-4">
                <p class="font-medium">{{ store.name }}</p>
                <p class="text-muted-foreground text-xs">{{ store.address }}</p>
                <p class="text-xs">{{ store.hours }}</p>
              </div>
            </ng-map-popup>
          }
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMapPin, lucideSearch })],
})
export class ZardDemoMapBlockStoreLocatorComponent {
  protected map: MapLibreMap | null = null;
  protected readonly home = HOME;

  protected readonly query = signal('');
  protected readonly selected = signal<Store | null>(null);

  protected readonly results = computed(() => {
    const query = this.query().trim().toLowerCase();
    return STORES.filter(store => !query || `${store.name} ${store.address}`.toLowerCase().includes(query));
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(store: Store): void {
    this.selected.set(store);
    this.map?.flyTo({ center: [store.lng, store.lat], zoom: 13.5, duration: 1200, essential: true });
  }

  /** Straight-line distance from the center of the city, in kilometers. */
  protected distance(store: Store): string {
    const dx = (store.lng - HOME[0]) * 111.32 * Math.cos((HOME[1] * Math.PI) / 180);
    const dy = (store.lat - HOME[1]) * 110.57;
    return Math.hypot(dx, dy).toFixed(1);
  }
}
