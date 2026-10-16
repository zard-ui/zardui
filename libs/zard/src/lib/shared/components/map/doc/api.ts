import type { ApiProp, ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

import { MAP_DRAW_API } from '../../map-draw/doc/api';
import { MAP_STYLE_SELECT_API } from '../../map-style-select/doc/api';

/**
 * The map is powered by ng-mapcn, so most of this documents a third-party API: the inputs and outputs of the
 * `ng-*` selectors belong to ng-mapcn and are listed here for convenience. The reference of record is
 * https://ng-mapcn.vercel.app/docs/api-reference. `provideZardMap()`, `ZardMapStyleService` and
 * `z-map-style-select` are zard's own.
 */

const className = (what: string): ApiProp => ({
  name: '[className]',
  description: `Extra space-separated classes for ${what}. The built-in classes are kept`,
  type: 'string',
  default: '-',
});

const beforeId = (what: string): ApiProp => ({
  name: '[beforeId]',
  description: `Id of an existing layer to insert ${what} before, for z-order control. Applied at creation only`,
  type: 'string',
  default: '-',
});

const idProp = (what: string): ApiProp => ({
  name: '[id]',
  description: `Identifier prefix of ${what}. Generated when omitted. Changing it recreates them`,
  type: 'string',
  default: 'auto',
});

const labelsProp = (what: string): ApiProp => ({
  name: '[labels]',
  description: `Label overrides for ${what}, merged over \`provideZardMap({ labels })\` and the English defaults`,
  type: 'Partial<MapLabels>',
  default: '-',
});

const paintProp = (name: string, what: string): ApiProp => ({
  name,
  description: what,
  type: 'MapLibre paint properties',
  default: '-',
});

export const MAP_API: ApiSection[] = [
  {
    selector: 'ng-map',
    description:
      'The map host. It fills its parent, so give the parent an explicit height. The map follows the `dark` class on `<html>`, which `ZardDarkMode` toggles, and swaps its basemap live. Every other `ng-*` element goes inside it.',
    props: [
      {
        name: '[center]',
        description: 'Initial center as [longitude, latitude]',
        type: '[number, number]',
        default: '[0, 0]',
      },
      { name: '[zoom]', description: 'Initial zoom level', type: 'number', default: '2' },
      {
        name: '[viewport]',
        description: 'Controlled camera: center, zoom, bearing and pitch. Pair it with `(viewportChange)`',
        type: 'Partial<MapViewport>',
        default: '-',
      },
      {
        name: '[styles]',
        description:
          'Basemap for this map, one style per theme (a style URL or a style JSON). Wins over the app-wide basemap',
        type: 'MapStylesConfig',
        default: 'app-wide basemap',
      },
      {
        name: '[blank]',
        description: 'Tile-less style with a transparent background, for dataviz. Ignored when `[styles]` is set',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[theme]',
        description: 'Leave it on `auto`: the map follows the `dark` class on `<html>`',
        type: "'light' | 'dark' | 'auto'",
        default: "'auto'",
      },
      {
        name: '[projection]',
        description: 'MapLibre projection, for example `{ type: "globe" }`',
        type: 'ProjectionSpecification',
        default: '-',
      },
      {
        name: '[fitBounds]',
        description:
          'Fits the camera to `bounds`, or to the data of the children (markers, GeoJSON, routes, arcs, clusters, heatmaps) once loaded',
        type: 'MapFitBoundsOptions',
        default: '-',
      },
      { name: '[loading]', description: 'Shows the loader on top of the map', type: 'boolean', default: 'false' },
      labelsProp('this map'),
      {
        name: '[options]',
        description: 'Raw MapLibre `MapOptions` (pitch, bearing, minZoom, maxBounds, ...) spread into the constructor',
        type: 'Omit<MapOptions, "container" | "style">',
        default: '-',
      },
    ],
    outputs: [
      { name: '(mapReady)', description: 'Emits the MapLibre map once it has loaded', type: 'Map', default: '-' },
      {
        name: '(viewportChange)',
        description: 'Emits on every camera frame while the map moves',
        type: 'MapViewport',
        default: '-',
      },
      { name: '(mapClick)', description: 'Emits when the map is clicked', type: 'MapMouseEvent', default: '-' },
      {
        name: '(mapError)',
        description:
          'Emits when MapLibre reports an error: no WebGL2, a failed style or tile request, a rejected layer',
        type: 'Error',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-map-controls',
    description: 'Zoom, compass, locate and fullscreen buttons, styled with the zard tokens.',
    props: [
      {
        name: '[position]',
        description: 'Corner of the map',
        type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: "'bottom-right'",
      },
      { name: '[showZoom]', description: 'Shows the zoom in and out buttons', type: 'boolean', default: 'true' },
      {
        name: '[showCompass]',
        description: 'Shows the compass: click to reset north and pitch',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[showLocate]',
        description: 'Shows the locate button (browser geolocation)',
        type: 'boolean',
        default: 'false',
      },
      { name: '[showFullscreen]', description: 'Shows the fullscreen button', type: 'boolean', default: 'false' },
      labelsProp('the tooltips of the buttons'),
      className('the controls element'),
    ],
    outputs: [
      {
        name: '(locateChange)',
        description: 'Emits after a successful geolocation. Treat the coordinates as personal data',
        type: '{ longitude: number; latitude: number }',
        default: '-',
      },
      {
        name: '(locateError)',
        description: 'Emits when geolocation fails (permission denied, timeout) or the browser has none',
        type: 'Error | GeolocationPositionError',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-map-marker',
    description:
      'A marker with optional `ng-marker-content`, `ng-marker-label`, `ng-marker-popup` and `ng-marker-tooltip` children. Keyboard: Enter and Space click it, and the arrow keys drag a draggable one.',
    props: [
      { name: '[longitude]', description: 'Longitude', type: 'number', default: '-' },
      { name: '[latitude]', description: 'Latitude', type: 'number', default: '-' },
      { name: '[draggable]', description: 'Lets the user drag the marker', type: 'boolean', default: 'false' },
      {
        name: '[offset]',
        description: 'Pixel offset of the marker from its position',
        type: 'PointLike',
        default: '-',
      },
      { name: '[rotation]', description: 'Rotation in degrees', type: 'number', default: '0' },
      {
        name: '[anchor]',
        description: 'Which part of the marker sits on the position. Applied at creation only',
        type: 'PositionAnchor',
        default: "'center'",
      },
      {
        name: '[rotationAlignment]',
        description: 'What the rotation is relative to',
        type: 'Alignment',
        default: "'auto'",
      },
      { name: '[pitchAlignment]', description: 'What the pitch is relative to', type: 'Alignment', default: "'auto'" },
      {
        name: '[ariaLabel]',
        description:
          'Accessible name of the marker. An interactive marker without text falls back to the `marker` label',
        type: 'string',
        default: '-',
      },
      labelsProp('the marker'),
      {
        name: '[keyboardStep]',
        description: 'Pixels an arrow key drags a focused draggable marker',
        type: 'number',
        default: '10',
      },
      { name: '[keyboardStepLarge]', description: 'The same with Shift held', type: 'number', default: '50' },
    ],
    outputs: [
      {
        name: '(markerClick)',
        description: 'Emits on click, and on Enter or Space when focused',
        type: 'MouseEvent',
        default: '-',
      },
      {
        name: '(markerMouseEnter)',
        description: 'Emits when the pointer enters the marker',
        type: 'MouseEvent',
        default: '-',
      },
      {
        name: '(markerMouseLeave)',
        description: 'Emits when the pointer leaves the marker',
        type: 'MouseEvent',
        default: '-',
      },
      {
        name: '(dragStart)',
        description: 'Emits when a drag starts',
        type: '{ lng: number; lat: number }',
        default: '-',
      },
      {
        name: '(drag)',
        description: 'Emits on every frame of a drag',
        type: '{ lng: number; lat: number }',
        default: '-',
      },
      {
        name: '(dragEnd)',
        description: 'Emits the new position after a drag',
        type: '{ lng: number; lat: number }',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-marker-content',
    description:
      'Custom HTML for the marker. Empty, it renders the default dot, so always include it for a plain marker.',
    props: [className('the marker content')],
  },
  {
    selector: 'ng-marker-label',
    description: 'A text label above or below the marker.',
    props: [{ name: '[position]', description: 'Side of the marker', type: "'top' | 'bottom'", default: "'top'" }],
  },
  {
    selector: 'ng-marker-popup',
    description: 'A popup that opens when the marker is clicked. Styled as a zard popover.',
    props: [
      { name: '[closeButton]', description: 'Shows a close button', type: 'boolean', default: 'false' },
      { name: '[offset]', description: 'Pixel offset from the marker', type: 'Offset', default: '-' },
      {
        name: '[anchor]',
        description: 'Side of the marker the popup anchors to. Applied at creation only',
        type: 'PositionAnchor',
        default: 'auto',
      },
      { name: '[maxWidth]', description: 'CSS max-width of the popup', type: 'string', default: "'none'" },
      {
        name: '[closeOnClick]',
        description: 'Closes the popup when the map is clicked. Applied at creation only',
        type: 'boolean',
        default: 'false',
      },
      labelsProp('the close button'),
      className('the popup card'),
    ],
    outputs: [{ name: '(popupClose)', description: 'Emits whenever the popup closes', type: 'void', default: '-' }],
  },
  {
    selector: 'ng-marker-tooltip',
    description: 'A tooltip that shows while the marker is hovered or focused.',
    props: [
      { name: '[offset]', description: 'Pixel offset from the marker', type: 'Offset', default: '16' },
      {
        name: '[anchor]',
        description: 'Side of the marker the tooltip anchors to. Applied at creation only',
        type: 'PositionAnchor',
        default: 'auto',
      },
      className('the tooltip pill'),
    ],
  },
  {
    selector: 'ng-map-popup',
    description: 'A standalone popup at a longitude and latitude, with no marker.',
    props: [
      { name: '[longitude]', description: 'Longitude', type: 'number', default: '-' },
      { name: '[latitude]', description: 'Latitude', type: 'number', default: '-' },
      {
        name: '[(open)]',
        description: 'Whether the popup is shown. Closing it from the map updates the binding',
        type: 'boolean',
        default: 'true',
      },
      { name: '[closeButton]', description: 'Shows a close button', type: 'boolean', default: 'false' },
      { name: '[offset]', description: 'Pixel offset from the position', type: 'Offset', default: '16' },
      { name: '[maxWidth]', description: 'CSS max-width of the popup', type: 'string', default: "'none'" },
      {
        name: '[closeOnClick]',
        description: 'Closes the popup when the map is clicked. Applied at creation only',
        type: 'boolean',
        default: 'true',
      },
      labelsProp('the close button'),
      className('the popup card'),
    ],
    outputs: [{ name: '(popupClose)', description: 'Emits whenever the popup closes', type: 'void', default: '-' }],
  },
  {
    selector: 'ng-map-route',
    description:
      'A line through a list of coordinates. Add `ng-route-progress` for a covered part and `ng-route-marker` for markers along it.',
    props: [
      {
        name: '[coordinates]',
        description: 'The path as [longitude, latitude] pairs',
        type: '[number, number][]',
        default: '-',
      },
      idProp('the source and layer'),
      { name: '[color]', description: 'Line color', type: 'string', default: "'#4285F4'" },
      { name: '[width]', description: 'Line width in pixels', type: 'number', default: '3' },
      { name: '[opacity]', description: 'Line opacity', type: 'number', default: '0.8' },
      { name: '[dashArray]', description: 'Dash pattern as [dash, gap]', type: '[number, number]', default: '-' },
      {
        name: '[interactive]',
        description: 'Whether the route responds to mouse events',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[progress]',
        description: 'Covered fraction of the route, from 0 to 1, drawn by `ng-route-progress`',
        type: 'number',
        default: '-',
      },
      {
        name: '[active]',
        description: 'Highlights the route: the `active*` inputs override the base paint',
        type: 'boolean',
        default: 'false',
      },
      { name: '[activeColor]', description: 'Color while `active`', type: 'string', default: '-' },
      { name: '[activeWidth]', description: 'Width while `active`', type: 'number', default: '-' },
      { name: '[activeOpacity]', description: 'Opacity while `active`', type: 'number', default: '-' },
      { name: '[activeDashArray]', description: 'Dash pattern while `active`', type: '[number, number]', default: '-' },
      beforeId('the route and its progress line'),
    ],
    outputs: [
      { name: '(routeClick)', description: 'Emits when the route is clicked', type: 'MapMouseEvent', default: '-' },
      {
        name: '(routeMouseEnter)',
        description: 'Emits when the pointer enters the route',
        type: 'MapMouseEvent',
        default: '-',
      },
      {
        name: '(routeMouseLeave)',
        description: 'Emits when the pointer leaves the route',
        type: 'MapMouseEvent',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-route-progress',
    description: 'The covered part of the parent `ng-map-route`, drawn up to its `[progress]`.',
    props: [
      { name: '[color]', description: 'Line color', type: 'string', default: "'#22c55e'" },
      { name: '[width]', description: 'Line width in pixels', type: 'number', default: 'width of the route' },
      { name: '[opacity]', description: 'Line opacity', type: 'number', default: '1' },
      { name: '[dashArray]', description: 'Dash pattern as [dash, gap]', type: '[number, number]', default: '-' },
    ],
  },
  {
    selector: 'ng-route-marker',
    description: 'A marker placed along the parent `ng-map-route`. Project an `ng-marker-content` into it.',
    props: [
      {
        name: '[at]',
        description: 'Where it sits: the start, the end, the current progress, or a fraction from 0 to 1',
        type: "'start' | 'end' | 'progress' | number",
        default: "'start'",
      },
    ],
  },
  {
    selector: 'ng-map-arc',
    description:
      'Curved arcs between origin and destination points, such as flight paths. An invisible wide layer under the line keeps hover and click comfortable. Arcs that cross the antimeridian take the short way.',
    props: [
      {
        name: '[data]',
        description:
          'The arcs. Extra keys travel with the datum: they come back in the events and in paint expressions',
        type: 'MapArcDatum[]',
        default: '-',
      },
      idProp('the source and layers'),
      {
        name: '[curvature]',
        description: 'Bend of the arc relative to its length. 0 is a straight line',
        type: 'number',
        default: '0.2',
      },
      { name: '[samples]', description: 'Segments used to approximate each arc', type: 'number', default: '64' },
      paintProp('[paint]', 'Paint of the line. Datum keys are readable with ["get", key]'),
      { name: '[layout]', description: 'Layout of the line', type: 'MapLibre line layout', default: '-' },
      paintProp('[hoverPaint]', 'Paint applied to the hovered arc'),
      { name: '[interactive]', description: 'Whether arcs respond to mouse events', type: 'boolean', default: 'true' },
      beforeId('the arc layers'),
    ],
    outputs: [
      { name: '(arcClick)', description: 'Emits the clicked arc', type: 'MapArcEvent', default: '-' },
      {
        name: '(arcHover)',
        description: 'Emits the hovered arc, or null when the pointer leaves',
        type: 'MapArcEvent | null',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-map-geojson',
    description:
      'Renders GeoJSON as fill and outline layers. With `[blank]` on the map it makes a choropleth. Declarative hover needs `promoteId` and `fillHoverPaint`.',
    props: [
      {
        name: '[data]',
        description: 'A FeatureCollection, Feature or Geometry, or a URL to fetch it from',
        type: 'MapGeoJSONData | string',
        default: '-',
      },
      idProp('the source and layers'),
      {
        name: '[promoteId]',
        description: 'Feature property to promote to the feature id. Required for hover feature-state',
        type: 'string',
        default: '-',
      },
      paintProp('[fillPaint]', 'Paint of the fill layer, merged onto theme defaults. `false` omits the layer'),
      paintProp('[linePaint]', 'Paint of the outline layer, merged onto a hairline. `false` omits the layer'),
      paintProp('[fillHoverPaint]', 'Paint applied to the hovered feature. Requires `promoteId`'),
      {
        name: '[interactive]',
        description: 'Whether features respond to mouse events',
        type: 'boolean',
        default: 'false',
      },
      beforeId('the layers'),
    ],
    outputs: [
      { name: '(featureClick)', description: 'Emits the clicked feature', type: 'MapGeoJSONEvent', default: '-' },
      {
        name: '(featureHover)',
        description: 'Emits the hovered feature, or null when the pointer leaves',
        type: 'MapGeoJSONEvent | null',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-map-cluster-layer',
    description:
      'Clustered points with count labels and threshold-based colors and sizes. A click on a cluster zooms into it.',
    props: [
      {
        name: '[data]',
        description: 'A FeatureCollection of points, or a URL to fetch it from',
        type: 'FeatureCollection<Point> | string',
        default: '-',
      },
      idProp('the source and layers'),
      {
        name: '[clusterMaxZoom]',
        description: 'Highest zoom level that still clusters',
        type: 'number',
        default: '14',
      },
      { name: '[clusterRadius]', description: 'Radius of a cluster in pixels', type: 'number', default: '50' },
      {
        name: '[clusterColors]',
        description: 'Colors of the small, medium and large clusters',
        type: '[string, string, string]',
        default: "['#22c55e', '#eab308', '#ef4444']",
      },
      {
        name: '[clusterThresholds]',
        description: 'Point counts where the medium and large steps start',
        type: '[number, number]',
        default: '[100, 750]',
      },
      {
        name: '[pointColor]',
        description: 'Color of a single, unclustered point',
        type: 'string',
        default: "'#3b82f6'",
      },
      {
        name: '[zoomOnClusterClick]',
        description: 'Zooms into a cluster when it is clicked',
        type: 'boolean',
        default: 'true',
      },
      beforeId('the cluster layers'),
    ],
    outputs: [
      {
        name: '(pointClick)',
        description: 'Emits a clicked single point',
        type: 'ClusterPointClickEvent',
        default: '-',
      },
      { name: '(clusterClick)', description: 'Emits a clicked cluster', type: 'ClusterClickEvent', default: '-' },
    ],
  },
  {
    selector: 'ng-map-heatmap',
    description: 'A point-density heatmap with a theme-aware gradient.',
    props: [
      {
        name: '[data]',
        description: 'A FeatureCollection of points, or a URL to fetch it from',
        type: 'FeatureCollection<Point> | string',
        default: '-',
      },
      idProp('the source and layer'),
      {
        name: '[weightProperty]',
        description: 'Feature property used as the weight of a point',
        type: 'string',
        default: '-',
      },
      {
        name: '[weightRange]',
        description: '[min, max] of the weight property, mapped to a weight from 0 to 1',
        type: '[number, number]',
        default: '[0, 1]',
      },
      {
        name: '[radius]',
        description: 'Influence radius of a point in pixels, or an expression',
        type: 'number | Expression',
        default: '30',
      },
      {
        name: '[intensity]',
        description: 'Global intensity multiplier, or an expression',
        type: 'number | Expression',
        default: '1',
      },
      { name: '[opacity]', description: 'Layer opacity, or an expression', type: 'number | Expression', default: '1' },
      {
        name: '[gradient]',
        description: 'Color ramp over the density. A theme-aware default when omitted',
        type: 'HeatmapGradient',
        default: '-',
      },
      { name: '[minZoom]', description: 'Lowest zoom the heatmap is drawn at', type: 'number', default: '0' },
      {
        name: '[maxZoom]',
        description: 'Zoom from which the heatmap is no longer drawn',
        type: 'number',
        default: '24',
      },
      paintProp('[paint]', 'Heatmap paint properties merged last, over everything above'),
      beforeId('the layer'),
    ],
  },
  {
    selector: 'ng-map-raster-source',
    description: 'A raster tile source (XYZ, TMS or WMS) plus the layer that draws it.',
    props: [
      idProp('the source and layer'),
      {
        name: '[tiles]',
        description: 'Tile URL templates, such as https://example.com/{z}/{x}/{y}.png',
        type: 'string[]',
        default: '-',
      },
      { name: '[url]', description: 'URL of a TileJSON document, instead of `tiles`', type: 'string', default: '-' },
      { name: '[tileSize]', description: 'Tile size in pixels. Applied at creation', type: 'number', default: '256' },
      { name: '[minzoom]', description: 'Lowest zoom of the tiles. Applied at creation', type: 'number', default: '0' },
      {
        name: '[maxzoom]',
        description: 'Highest zoom of the tiles. Applied at creation',
        type: 'number',
        default: '22',
      },
      {
        name: '[attribution]',
        description: 'Shown in the attribution control. Applied at creation',
        type: 'string',
        default: '-',
      },
      {
        name: '[bounds]',
        description: '[west, south, east, north] limit of the tiles. Applied at creation',
        type: '[number, number, number, number]',
        default: '-',
      },
      { name: '[scheme]', description: 'Tile scheme. Applied at creation', type: "'xyz' | 'tms'", default: "'xyz'" },
      { name: '[opacity]', description: 'Layer opacity, or an expression', type: 'number | Expression', default: '1' },
      {
        name: '[visible]',
        description: 'Whether the layer is drawn. The source stays loaded when hidden',
        type: 'boolean',
        default: 'true',
      },
      paintProp('[paint]', 'Raster paint properties merged last, such as `raster-saturation`'),
      beforeId('the layer'),
    ],
  },
  {
    selector: 'ng-map-vector-source',
    description:
      'A vector tile source (MVT, TileJSON or `pmtiles://`). It only adds the source: draw it with a layer component such as `ng-map-fill-extrusion`, which waits for it.',
    props: [
      idProp('the source'),
      {
        name: '[tiles]',
        description: 'Tile URL templates, such as https://example.com/{z}/{x}/{y}.mvt',
        type: 'string[]',
        default: '-',
      },
      {
        name: '[url]',
        description: 'URL of a TileJSON document, or `pmtiles://<archive url>`. Takes precedence over `tiles`',
        type: 'string',
        default: '-',
      },
      { name: '[minzoom]', description: 'Lowest zoom of the tiles. Applied at creation', type: 'number', default: '0' },
      {
        name: '[maxzoom]',
        description: 'Highest zoom of the tiles. Applied at creation',
        type: 'number',
        default: '22',
      },
      {
        name: '[attribution]',
        description: 'Shown in the attribution control. Applied at creation',
        type: 'string',
        default: '-',
      },
      {
        name: '[bounds]',
        description: '[west, south, east, north] limit of the tiles. Applied at creation',
        type: '[number, number, number, number]',
        default: '-',
      },
      { name: '[scheme]', description: 'Tile scheme. Applied at creation', type: "'xyz' | 'tms'", default: "'xyz'" },
      {
        name: '[promoteId]',
        description: 'Feature property used as the feature id, which enables feature-state',
        type: 'PromoteIdSpecification',
        default: '-',
      },
    ],
  },
  {
    selector: 'ng-map-image-overlay',
    description: 'An image pinned to four corner coordinates, such as a scanned map or a radar frame.',
    props: [
      idProp('the source and layer'),
      { name: '[url]', description: 'Image URL', type: 'string', default: '-' },
      {
        name: '[coordinates]',
        description: 'The four [longitude, latitude] corners, clockwise from the top left',
        type: 'ImageOverlayCoordinates',
        default: '-',
      },
      { name: '[opacity]', description: 'Layer opacity, or an expression', type: 'number | Expression', default: '1' },
      { name: '[visible]', description: 'Whether the layer is drawn', type: 'boolean', default: 'true' },
      paintProp('[paint]', 'Raster paint properties merged last'),
      beforeId('the layer'),
    ],
  },
  {
    selector: 'ng-map-fill-extrusion',
    description:
      'A 3D extrusion of polygons, such as buildings. It defaults to the `building` layer of the Carto basemaps, so pin Carto with `[styles]` on that map. Tilt the map to see it.',
    props: [
      idProp('the layer'),
      {
        name: '[source]',
        description: 'Id of the source to extrude: a basemap source or a source component',
        type: 'string',
        default: "'carto'",
      },
      {
        name: '[sourceLayer]',
        description: 'Layer of a vector source',
        type: 'string',
        default: "'building' for carto",
      },
      {
        name: '[heightProperty]',
        description: 'Feature property with the height in meters',
        type: 'string',
        default: "'render_height'",
      },
      {
        name: '[baseProperty]',
        description: 'Feature property with the base height in meters',
        type: 'string',
        default: "'render_min_height'",
      },
      {
        name: '[color]',
        description: 'Fill color, or an expression. A theme-aware gray by default',
        type: 'string | Expression',
        default: '-',
      },
      { name: '[opacity]', description: 'Layer opacity, from 0 to 1', type: 'number', default: '0.8' },
      { name: '[minZoom]', description: 'Lowest zoom the extrusion is drawn at', type: 'number', default: '14' },
      {
        name: '[maxZoom]',
        description: 'Zoom from which the extrusion is no longer drawn',
        type: 'number',
        default: '24',
      },
      {
        name: '[filter]',
        description: 'MapLibre filter. Skips `hide_3d` buildings by default; `null` for none',
        type: 'FilterSpecification | null',
        default: '-',
      },
      paintProp('[paint]', 'Fill-extrusion paint properties merged last'),
      beforeId('the layer'),
    ],
  },
  {
    selector: 'ng-map-terrain',
    description:
      '3D terrain from a `raster-dem` source, with an optional hillshade. Public Terrarium tiles by default. Only one terrain per map.',
    props: [
      idProp('the sources and layers'),
      {
        name: '[tiles]',
        description: 'Elevation tile URL templates. Public Terrarium tiles by default',
        type: 'string[]',
        default: '-',
      },
      { name: '[url]', description: 'TileJSON URL, instead of `tiles`', type: 'string', default: '-' },
      {
        name: '[encoding]',
        description: 'Encoding of the elevation tiles',
        type: "'terrarium' | 'mapbox'",
        default: "'terrarium'",
      },
      { name: '[tileSize]', description: 'Tile size in pixels', type: 'number', default: '256' },
      { name: '[minzoom]', description: 'Lowest zoom of the elevation tiles', type: 'number', default: '0' },
      { name: '[maxzoom]', description: 'Highest zoom of the elevation tiles', type: 'number', default: '15' },
      { name: '[attribution]', description: 'Shown in the attribution control', type: 'string', default: '-' },
      {
        name: '[exaggeration]',
        description: 'How tall the terrain looks. 1 is true scale',
        type: 'number',
        default: '1',
      },
      {
        name: '[hillshade]',
        description: 'Draws a hillshade layer over the terrain',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[hillshadeExaggeration]',
        description: 'Hillshade intensity, from 0 to 1',
        type: 'number',
        default: '0.5',
      },
      { name: '[hillshadeShadowColor]', description: 'Color of the shaded slopes', type: 'string', default: '-' },
      { name: '[hillshadeHighlightColor]', description: 'Color of the lit slopes', type: 'string', default: '-' },
      { name: '[hillshadeAccentColor]', description: 'Accent color of steep slopes', type: 'string', default: '-' },
      paintProp('[hillshadePaint]', 'Hillshade paint properties merged last'),
      beforeId('the hillshade layer'),
    ],
  },
  {
    selector: 'provideZardMap(config?)',
    description:
      'Registers the map defaults. Put it in the `providers` of the lazy route that renders the maps, not in `app.config.ts`: ng-mapcn is not tree-shakeable and would join the initial bundle of every route.',
    props: [
      {
        name: 'style',
        description: 'Id of the preset every map starts with. A stored choice wins when `persist` is on',
        type: 'string',
        default: "'carto-positron'",
      },
      {
        name: 'keys',
        description: 'API keys of the key-based providers, such as `{ maptiler: "..." }`. Never hard-code them',
        type: "Partial<Record<'maptiler' | 'stadia', string>>",
        default: '{}',
      },
      {
        name: 'persist',
        description:
          'Remembers the picked preset (and the keys typed into the picker) in `localStorage`, browser only. A string picks the storage key',
        type: 'boolean | string',
        default: 'false',
      },
      {
        name: 'presets',
        description: 'The catalogue the picker lists. Add your own presets to `ZARD_MAP_PRESETS`',
        type: 'readonly ZardMapPreset[]',
        default: 'ZARD_MAP_PRESETS',
      },
      {
        name: 'styles',
        description:
          'A fixed basemap per theme, or a signal of one. When set, the service and the picker no longer drive the maps',
        type: 'MapStylesConfig | Signal<MapStylesConfig | undefined> | (() => Signal<MapStylesConfig | undefined>)',
        default: '-',
      },
      {
        name: 'labels',
        description: 'Translations for the control tooltips, the loader and the popup close button',
        type: 'Partial<MapLabels> | Signal<Partial<MapLabels> | undefined> | (() => Signal<Partial<MapLabels> | undefined>)',
        default: 'English',
      },
    ],
  },
  {
    selector: 'ZardMapStyleService',
    description:
      'Holds the basemap preset of every map. A root service, so a choice made on one page is the one the next page opens with. Inject it to switch the basemap from your own UI.',
    props: [
      {
        name: 'select(id, key?)',
        description: 'Switches every map to a preset, live. Returns "selected", "unknown-preset" or "needs-key"',
        type: 'ZardMapSelectResult',
        default: '-',
      },
      {
        name: 'setKey(provider, key)',
        description: 'Stores the API key of a provider. An empty key forgets it',
        type: 'void',
        default: '-',
      },
      { name: 'reset()', description: 'Back to the default preset', type: 'void', default: '-' },
      { name: 'presetId', description: 'Id of the preset in use', type: 'Signal<string>', default: "'carto-positron'" },
      {
        name: 'preset',
        description: 'The preset in use. A key-based preset without a key falls back to the default',
        type: 'Signal<ZardMapPreset>',
        default: '-',
      },
      {
        name: 'presets',
        description: 'Every preset the picker lists',
        type: 'Signal<readonly ZardMapPreset[]>',
        default: 'ZARD_MAP_PRESETS',
      },
      {
        name: 'styles',
        description: 'The light and dark styles of the preset in use: what `provideZardMap()` hands to ng-mapcn',
        type: 'Signal<ZardMapStyles>',
        default: '-',
      },
      {
        name: 'keys',
        description: 'The API keys the service knows, by provider',
        type: 'Signal<ZardMapKeys>',
        default: '{}',
      },
    ],
  },
  ...MAP_STYLE_SELECT_API,
  ...MAP_DRAW_API,
];
