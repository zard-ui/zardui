import type { Type } from '@angular/core';

import { MAP_DEMO_BLOCK_ANALYTICS_CARD } from '@generated/components/map/demo/block-analytics-card';
import { MAP_DEMO_BLOCK_ANALYTICS_MAP } from '@generated/components/map/demo/block-analytics-map';
import { MAP_DEMO_BLOCK_CHOROPLETH } from '@generated/components/map/demo/block-choropleth';
import { MAP_DEMO_BLOCK_CITY_3D } from '@generated/components/map/demo/block-city-3d';
import { MAP_DEMO_BLOCK_CLUSTERS } from '@generated/components/map/demo/block-clusters';
import { MAP_DEMO_BLOCK_DELIVERY_TRACKER } from '@generated/components/map/demo/block-delivery-tracker';
import { MAP_DEMO_BLOCK_DRAW } from '@generated/components/map/demo/block-draw';
import { MAP_DEMO_BLOCK_FLIGHTS } from '@generated/components/map/demo/block-flights';
import { MAP_DEMO_BLOCK_HEATMAP } from '@generated/components/map/demo/block-heatmap';
import { MAP_DEMO_BLOCK_LOGISTICS_NETWORK } from '@generated/components/map/demo/block-logistics-network';
import { MAP_DEMO_BLOCK_STORE_LOCATOR } from '@generated/components/map/demo/block-store-locator';
import { MAP_DEMO_BLOCK_TERRAIN } from '@generated/components/map/demo/block-terrain';
import { MAP_DEMO_BLOCK_UPTIME_MONITOR } from '@generated/components/map/demo/block-uptime-monitor';
import type { CodeBlockData } from '@highlight/types';

import type { MapCategory } from '../services/maps.service';

/** One copy-pasteable block on the /maps gallery. */
export interface MapBlock {
  /** Matches the demo file name without the `block-` prefix, e.g. `delivery-tracker`. It is also the anchor. */
  id: string;
  title: string;
  /** One line about the block: the description of its code sheet. */
  description: string;
  category: MapCategory;
  /**
   * The block component. It is loaded only when the block comes on screen: every block imports ng-mapcn, and the
   * draw block brings terra-draw too, so none of it may reach the chunk of the gallery page itself.
   */
  load: () => Promise<Type<unknown>>;
  codeData: CodeBlockData;
  /**
   * The height of the preview frame, as Tailwind classes. It is fixed, and the same one holds the place before the
   * block is there, so nothing moves while the map loads.
   */
  frameClass: string;
}

/**
 * Every gallery block, in the order they appear on the page, grouped by category. The components and their
 * highlighted code come from the same source as the docs page, `libs/zard/…/map/demo`, so the two never drift apart.
 */
export const MAP_BLOCKS: MapBlock[] = [
  {
    id: 'analytics-map',
    title: 'Analytics Map',
    description: 'Real-time analytics overview with a world map, breakdown cards and device stats.',
    category: 'analytics',
    load: () =>
      import('@zard/components/map/demo/block-analytics-map').then(m => m.ZardDemoMapBlockAnalyticsMapComponent),
    codeData: MAP_DEMO_BLOCK_ANALYTICS_MAP,
    frameClass: 'h-[720px] min-[816px]:h-[1230px] min-[1072px]:h-[960px]',
  },
  {
    id: 'choropleth',
    title: 'Choropleth',
    description: 'World choropleth map shading countries by a metric, with a hover tooltip and a legend.',
    category: 'analytics',
    load: () => import('@zard/components/map/demo/block-choropleth').then(m => m.ZardDemoMapBlockChoroplethComponent),
    codeData: MAP_DEMO_BLOCK_CHOROPLETH,
    frameClass: 'h-[560px] md:h-[680px]',
  },
  {
    id: 'analytics-card',
    title: 'Analytics Card',
    description: 'Compact analytics card with a headline metric over a world map.',
    category: 'analytics',
    load: () =>
      import('@zard/components/map/demo/block-analytics-card').then(m => m.ZardDemoMapBlockAnalyticsCardComponent),
    codeData: MAP_DEMO_BLOCK_ANALYTICS_CARD,
    frameClass: 'h-[480px] md:h-[560px]',
  },
  {
    id: 'uptime-monitor',
    title: 'Uptime Monitor',
    description: 'Status-page style map of edge locations with live health, latency and uptime.',
    category: 'analytics',
    load: () =>
      import('@zard/components/map/demo/block-uptime-monitor').then(m => m.ZardDemoMapBlockUptimeMonitorComponent),
    codeData: MAP_DEMO_BLOCK_UPTIME_MONITOR,
    frameClass: 'h-[680px] md:h-[640px]',
  },
  {
    id: 'delivery-tracker',
    title: 'Delivery Tracker',
    description: 'Live order tracking with route progress, a courier on the move and the order details.',
    category: 'logistics',
    load: () =>
      import('@zard/components/map/demo/block-delivery-tracker').then(m => m.ZardDemoMapBlockDeliveryTrackerComponent),
    codeData: MAP_DEMO_BLOCK_DELIVERY_TRACKER,
    frameClass: 'h-[720px] md:h-[640px]',
  },
  {
    id: 'logistics-network',
    title: 'Logistics Network',
    description: 'A freight network of hubs and lanes, with filters and a sidebar of stats.',
    category: 'logistics',
    load: () =>
      import('@zard/components/map/demo/block-logistics-network').then(
        m => m.ZardDemoMapBlockLogisticsNetworkComponent,
      ),
    codeData: MAP_DEMO_BLOCK_LOGISTICS_NETWORK,
    frameClass: 'h-[720px] md:h-[640px]',
  },
  {
    id: 'store-locator',
    title: 'Store Locator',
    description: 'A searchable list of stores kept in sync with the markers on the map.',
    category: 'logistics',
    load: () =>
      import('@zard/components/map/demo/block-store-locator').then(m => m.ZardDemoMapBlockStoreLocatorComponent),
    codeData: MAP_DEMO_BLOCK_STORE_LOCATOR,
    frameClass: 'h-[720px] md:h-[640px]',
  },
  {
    id: 'heatmap',
    title: 'Heatmap',
    description: 'Live earthquake data as a heatmap weighted by magnitude, with a slider to filter the small ones.',
    category: 'data',
    load: () => import('@zard/components/map/demo/block-heatmap').then(m => m.ZardDemoMapBlockHeatmapComponent),
    codeData: MAP_DEMO_BLOCK_HEATMAP,
    frameClass: 'h-[560px] md:h-[680px]',
  },
  {
    id: 'clusters',
    title: 'Clusters',
    description: 'Thousands of points grouped into clusters that split as you zoom, and a card for the point you pick.',
    category: 'data',
    load: () => import('@zard/components/map/demo/block-clusters').then(m => m.ZardDemoMapBlockClustersComponent),
    codeData: MAP_DEMO_BLOCK_CLUSTERS,
    frameClass: 'h-[560px] md:h-[640px]',
  },
  {
    id: 'flights',
    title: 'Arcs and Flights',
    description: 'Great-circle arcs between airports: pick an origin and hover an arc to see the flight.',
    category: 'data',
    load: () => import('@zard/components/map/demo/block-flights').then(m => m.ZardDemoMapBlockFlightsComponent),
    codeData: MAP_DEMO_BLOCK_FLIGHTS,
    frameClass: 'h-[600px] md:h-[680px]',
  },
  {
    id: 'city-3d',
    title: '3D City',
    description: '3D buildings colored by height, with a tilted camera you can turn, or let it rotate on its own.',
    category: '3d',
    load: () => import('@zard/components/map/demo/block-city-3d').then(m => m.ZardDemoMapBlockCity3dComponent),
    codeData: MAP_DEMO_BLOCK_CITY_3D,
    frameClass: 'h-[560px] md:h-[680px]',
  },
  {
    id: 'terrain',
    title: 'Terrain',
    description: 'Real elevation with hillshade, so mountains stand up and the camera can tilt through them.',
    category: '3d',
    load: () => import('@zard/components/map/demo/block-terrain').then(m => m.ZardDemoMapBlockTerrainComponent),
    codeData: MAP_DEMO_BLOCK_TERRAIN,
    frameClass: 'h-[560px] md:h-[680px]',
  },
  {
    id: 'draw',
    title: 'Draw',
    description: 'Draw and edit points, lines and polygons with a toolbar and a live readout of the shapes.',
    category: 'draw',
    load: () => import('@zard/components/map/demo/block-draw').then(m => m.ZardDemoMapBlockDrawComponent),
    codeData: MAP_DEMO_BLOCK_DRAW,
    frameClass: 'h-[640px] md:h-[680px]',
  },
];
