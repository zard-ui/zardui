import { MapDrawComponent } from 'ng-mapcn/draw';

import { ZardMapImports } from '@/shared/components/map/map.imports';

/**
 * Everything to draw on a map: the map bundle plus `ng-map-draw`. Drawing is optional because it needs `terra-draw`
 * and `terra-draw-maplibre-gl-adapter`, which the core `map` item never loads.
 */
export const ZardMapDrawImports = [...ZardMapImports, MapDrawComponent] as const;
