# Map snippets

Illustrative code fragments used by the map docs page: the manual install steps, and code-only examples. Each fenced
block is exported as `MAP_SNIPPET_<ID>` via the snippet generator.

```json id="worker-assets" title="angular.json" copyButton
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              { "glob": "**/*", "input": "public" },
              { "glob": "maplibre-gl-worker.mjs", "input": "node_modules/maplibre-gl/dist", "output": "/" },
              { "glob": "maplibre-gl-shared.mjs", "input": "node_modules/maplibre-gl/dist", "output": "/" }
            ]
          }
        }
      }
    }
  }
}
```

```css id="global-styles" title="styles.css" copyButton
@import 'maplibre-gl/dist/maplibre-gl.css';
@import './app/shared/components/map/map.css';
```

```angular-ts id="lazy-route" title="app.routes.ts" copyButton
import { Routes } from '@angular/router';

import { provideZardMap } from '@/shared/components/map/map.provider';

export const routes: Routes = [
  {
    path: 'map',
    // ng-mapcn is not tree-shakeable: it pulls in all of MapLibre (about 1 MB). Register it on the lazy route that
    // renders the maps, not in app.config.ts, and the other routes keep their bundle.
    loadComponent: () => import('./map.page').then(m => m.MapPage),
    providers: [provideZardMap()],
  },
];
```

```angular-ts id="style-config" title="app.routes.ts" copyButton
import { provideZardMap } from '@/shared/components/map/map.provider';

export const routes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./map.page').then(m => m.MapPage),
    providers: [
      provideZardMap({
        // The preset every map starts with (see the table below). Carto Positron / Dark Matter by default.
        style: 'openfreemap-liberty',
        // Key-based presets only unlock with a key. Never commit a real one: read it from your environment.
        keys: { maptiler: environment.maptilerKey },
        // Remember the choice in localStorage (browser only), so it survives reloads and page changes.
        persist: true,
      }),
    ],
  },
];
```

```angular-ts id="style-service" title="basemap-toggle.ts" copyButton
import { Component, inject } from '@angular/core';

import { ZardMapStyleService } from '@/shared/components/map/map-style.service';

@Component({
  selector: 'app-basemap-toggle',
  template: `
    <button (click)="service.select('carto-voyager')">Voyager</button>
    <button (click)="service.select('openfreemap-liberty')">Liberty</button>
    <p>Now showing {{ service.preset().label }}</p>
  `,
})
export class BasemapToggle {
  // Every <ng-map> without its own [styles] swaps live: no reload, no remount.
  protected readonly service = inject(ZardMapStyleService);
}
```

```angular-ts id="lazy-loading" title="map.page.ts" copyButton
import { Component } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

// MapLibre is heavy: keep it out of the initial bundle with a lazy route (loadComponent), or with @defer when the
// map is only part of a page.
@Component({
  selector: 'app-map-page',
  imports: [ZardMapImports],
  template: `
    @defer (on viewport) {
      <div class="h-96">
        <ng-map [center]="[2.35, 48.85]" [zoom]="10" />
      </div>
    } @placeholder {
      <div class="bg-muted h-96 animate-pulse rounded-xl"></div>
    }
  `,
})
export class MapPage {}
```

```angular-ts id="webgl2" title="map.page.ts" copyButton
import { afterNextRender, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';

// MapLibre 6 needs WebGL2. Without it the map cannot start, so check first and show something useful instead of an
// empty box. (mapError) also reports tile and style failures, so do not use it as the "no WebGL2" signal.
@Component({
  selector: 'app-map-page',
  imports: [ZardMapImports],
  template: `
    <div class="h-96">
      @if (supported()) {
        <ng-map [center]="[2.35, 48.85]" [zoom]="10" (mapError)="onError($event)" />
      } @else {
        <p class="text-muted-foreground p-6 text-sm">Maps need WebGL2, which this browser does not provide.</p>
      }
    </div>
  `,
})
export class MapPage {
  protected readonly supported = signal(true);

  constructor() {
    afterNextRender(() => this.supported.set(!!document.createElement('canvas').getContext('webgl2')));
  }

  protected onError(error: Error): void {
    console.warn('Map error', error);
  }
}
```
