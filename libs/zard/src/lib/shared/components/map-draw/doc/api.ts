import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

/**
 * `ng-map-draw` belongs to ng-mapcn (the `ng-mapcn/draw` entry point, built on terra-draw), so this documents a
 * third-party API. See https://ng-mapcn.vercel.app/docs/api-reference.
 */
export const MAP_DRAW_API: ApiSection[] = [
  {
    selector: 'ng-map-draw',
    description: 'Draws, selects and edits points, lines and polygons; install it with `zard-cli add map-draw`.',
    props: [
      {
        name: '[modes]',
        description: 'Shapes the user can draw',
        type: "readonly ('point' | 'line' | 'polygon')[]",
        default: "['point', 'line', 'polygon']",
      },
      {
        name: '[(mode)]',
        description: 'Active tool; `static` only displays features',
        type: "'point' | 'line' | 'polygon' | 'select' | 'static'",
        default: "'static'",
      },
      {
        name: '[(features)]',
        description: 'Drawn features; the source of truth',
        type: 'MapDrawFeatureCollection',
        default: 'empty collection',
      },
      {
        name: '[editable]',
        description: 'Enables `select` mode for editing features',
        type: 'boolean',
        default: 'false',
      },
      { name: '[color]', description: 'Accent color as `#rrggbb`', type: 'DrawHexColor', default: '-' },
    ],
    outputs: [
      { name: '(drawEnd)', description: 'Emits when a shape is completed', type: 'MapDrawEvent', default: '-' },
      { name: '(featureEdit)', description: 'Emits when a feature is edited', type: 'MapDrawEvent', default: '-' },
      { name: '(featureSelect)', description: 'Emits the selected feature', type: 'MapDrawFeature', default: '-' },
      {
        name: '(featureDeselect)',
        description: 'Emits the deselected feature id',
        type: 'string | number',
        default: '-',
      },
    ],
  },
];
