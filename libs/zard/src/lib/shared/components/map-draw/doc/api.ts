import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

/**
 * `ng-map-draw` belongs to ng-mapcn (the `ng-mapcn/draw` entry point, built on terra-draw), so this documents a
 * third-party API. See https://ng-mapcn.vercel.app/docs/api-reference.
 */
export const MAP_DRAW_API: ApiSection[] = [
  {
    selector: 'ng-map-draw',
    description:
      'Draws, selects and edits points, lines and polygons on the map, built on terra-draw. Install it with `zard-cli add map-draw`; the core map never loads terra-draw. Enter finishes a shape, Escape cancels it and Delete removes the selected feature.',
    props: [
      {
        name: '[modes]',
        description: 'The shapes the user can draw',
        type: "readonly ('point' | 'line' | 'polygon')[]",
        default: "['point', 'line', 'polygon']",
      },
      {
        name: '[(mode)]',
        description: 'The active tool: a shape, `select` to pick and edit features, or `static` to only display them',
        type: "'point' | 'line' | 'polygon' | 'select' | 'static'",
        default: "'static'",
      },
      {
        name: '[(features)]',
        description:
          'The drawn features as a GeoJSON FeatureCollection. It is the source of truth: it updates when a draw, edit or delete completes, and assigning a new collection replaces what is shown',
        type: 'MapDrawFeatureCollection',
        default: 'empty collection',
      },
      {
        name: '[editable]',
        description: 'Enables the `select` mode: select, drag, reshape and delete features',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[color]',
        description: 'Accent color of the drawn shapes as `#rrggbb`. A theme-aware blue by default',
        type: 'DrawHexColor',
        default: '-',
      },
    ],
    outputs: [
      { name: '(drawEnd)', description: 'Emits when a new shape is completed', type: 'MapDrawEvent', default: '-' },
      {
        name: '(featureEdit)',
        description: 'Emits when an existing feature is moved, reshaped or otherwise edited',
        type: 'MapDrawEvent',
        default: '-',
      },
      {
        name: '(featureSelect)',
        description: 'Emits the feature selected in `select` mode',
        type: 'MapDrawFeature',
        default: '-',
      },
      {
        name: '(featureDeselect)',
        description: 'Emits the id of the feature that was deselected',
        type: 'string | number',
        default: '-',
      },
    ],
  },
];
