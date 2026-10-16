import type { Page } from '@playwright/test';

/**
 * MapLibre 6 needs WebGL2. Headless Chromium has it through SwiftShader once it is allowed: use these launch args
 * with `test.use({ launchOptions: { args: MAP_LAUNCH_ARGS } })`.
 */
export const MAP_LAUNCH_ARGS = [
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
];

/** A style with no tiles and a flat background: a map that loads instantly and needs no network. */
const style = (background: string) => ({
  version: 8,
  name: background,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': background } }],
});

const POINT = {
  type: 'Feature',
  properties: { mag: 5, place: 'Fixture', time: 1 },
  geometry: { type: 'Point', coordinates: [0, 0] },
};

const CORS = { 'access-control-allow-origin': '*' };

export interface MapRequests {
  /** Every basemap style the page asked for, in order. */
  styles: string[];
}

/**
 * Serves every external map request from a local fixture, so the specs never depend on Carto, OpenFreeMap, USGS or
 * jsDelivr being up. Basemap styles come back as flat backgrounds whose color tells light from dark.
 */
export async function routeMapTiles(page: Page): Promise<MapRequests> {
  const requests: MapRequests = { styles: [] };

  // Playwright runs the most recently registered route first, so the catch-all goes first and the specific ones win.
  // Any other tile, sprite, glyph or TileJSON request: an empty, successful answer.
  const tileHosts = new RegExp(
    [
      'basemaps.cartocdn.com',
      'tiles.openfreemap.org',
      'server.arcgisonline.com',
      'tile.opentopomap.org',
      'elevation-tiles-prod',
    ]
      .map(host => host.replaceAll('.', '\\.'))
      .join('|'),
  );
  await page.route(tileHosts, route => {
    if (route.request().url().endsWith('.json') && !/style\.json|\/styles\//.test(route.request().url())) {
      return route.fulfill({ headers: CORS, json: { tiles: [], vector_layers: [] } });
    }
    return route.fulfill({ status: 204, headers: CORS });
  });
  await page.route(/basemaps\.cartocdn\.com\/gl\/.*style\.json/, route => {
    const url = route.request().url();
    requests.styles.push(url);
    return route.fulfill({ headers: CORS, json: style(url.includes('dark-matter') ? '#111111' : '#f2f2f2') });
  });
  await page.route(/tiles\.openfreemap\.org\/styles\//, route => {
    const url = route.request().url();
    requests.styles.push(url);
    return route.fulfill({ headers: CORS, json: style(/dark|fiord/.test(url) ? '#1e232b' : '#d4e3c6') });
  });
  await page.route(/earthquake\.usgs\.gov/, route =>
    route.fulfill({ headers: CORS, json: { type: 'FeatureCollection', features: [POINT] } }),
  );
  await page.route(/natural-earth-vector/, route =>
    route.fulfill({
      headers: CORS,
      json: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { ADM0_A3: 'FIX', NAME: 'Fixtureland', POP_EST: 5e7, GDP_MD: 1e6 },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-20, -20],
                  [20, -20],
                  [20, 20],
                  [-20, 20],
                  [-20, -20],
                ],
              ],
            },
          },
        ],
      },
    }),
  );

  return requests;
}
