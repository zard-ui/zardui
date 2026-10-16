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

Draws, selects and edits points, lines and polygons on the map, built on terra-draw. Install it with `zard-cli add map-draw`; the core map never loads terra-draw. Enter finishes a shape, Escape cancels it and Delete removes the selected feature.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[modes]` | The shapes the user can draw | `readonly ('point' \| 'line' \| 'polygon')[]` | `['point', 'line', 'polygon']` |
| `[(mode)]` | The active tool: a shape, `select` to pick and edit features, or `static` to only display them | `'point' \| 'line' \| 'polygon' \| 'select' \| 'static'` | `'static'` |
| `[(features)]` | The drawn features as a GeoJSON FeatureCollection. It is the source of truth: it updates when a draw, edit or delete completes, and assigning a new collection replaces what is shown | `MapDrawFeatureCollection` | `empty collection` |
| `[editable]` | Enables the `select` mode: select, drag, reshape and delete features | `boolean` | `false` |
| `[color]` | Accent color of the drawn shapes as `#rrggbb`. A theme-aware blue by default | `DrawHexColor` | `-` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(drawEnd)` | Emits when a new shape is completed | `MapDrawEvent` | `-` |
| `(featureEdit)` | Emits when an existing feature is moved, reshaped or otherwise edited | `MapDrawEvent` | `-` |
| `(featureSelect)` | Emits the feature selected in `select` mode | `MapDrawFeature` | `-` |
| `(featureDeselect)` | Emits the id of the feature that was deselected | `string \| number` | `-` |

---

[Open in browser](https://zardui.com/docs/components/map-draw)
