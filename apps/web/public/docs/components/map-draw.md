---
title: Map Draw
description: Draw, select and edit points, lines and polygons on a map. An optional addition to the map.
---

# Map Draw

Draw, select and edit points, lines and polygons on a map. An optional addition to the map.

## About

Needs the map item, and adds terra-draw and its MapLibre adapter. The core map never loads them, so apps that do not draw never pay for them. It comes from the ng-mapcn/draw entry point.

[ng-mapcn](https://ng-mapcn.vercel.app)

## Installation

### CLI

```bash
npx zard-cli@latest add map-draw
```

### Manual

```angular-ts
export * from 'ng-mapcn/draw';
export * from './map-draw.imports';
```

```angular-ts
import { MapDrawComponent } from 'ng-mapcn/draw';

import { ZardMapImports } from '@/shared/components/map/map.imports';

/**
 * Everything to draw on a map: the map bundle plus `ng-map-draw`. Drawing is optional because it needs `terra-draw`
 * and `terra-draw-maplibre-gl-adapter`, which the core `map` item never loads.
 */
export const ZardMapDrawImports = [...ZardMapImports, MapDrawComponent] as const;
```

## Usage

```angular-ts
import { ZardMapDrawImports } from '@/shared/components/map-draw/map-draw.imports';
```

```angular-html
<div class="h-96 overflow-hidden rounded-xl border">
  <ng-map [center]="[-73.97, 40.78]" [zoom]="12">
    <ng-map-draw [(features)]="features" [(mode)]="mode" [modes]="['point', 'line', 'polygon']" />
  </ng-map>
</div>
```

## API Reference

### ng-map-draw

Draws, selects and edits points, lines and polygons; install it with `zard-cli add map-draw`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[modes]` | Shapes the user can draw | `readonly ('point' \| 'line' \| 'polygon')[]` | `['point', 'line', 'polygon']` |
| `[(mode)]` | Active tool; `static` only displays features | `'point' \| 'line' \| 'polygon' \| 'select' \| 'static'` | `'static'` |
| `[(features)]` | Drawn features; the source of truth | `MapDrawFeatureCollection` | `empty collection` |
| `[editable]` | Enables `select` mode for editing features | `boolean` | `false` |
| `[color]` | Accent color as `#rrggbb` | `DrawHexColor` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(drawEnd)` | Emits when a shape is completed | `MapDrawEvent` | `-` |
| `(featureEdit)` | Emits when a feature is edited | `MapDrawEvent` | `-` |
| `(featureSelect)` | Emits the selected feature | `MapDrawFeature` | `-` |
| `(featureDeselect)` | Emits the deselected feature id | `string \| number` | `-` |

---

[Open in browser](https://zardui.com/docs/components/map-draw)
