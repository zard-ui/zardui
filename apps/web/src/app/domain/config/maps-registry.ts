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
  /** Matches the demo file name without the `block-` prefix, e.g. `delivery-tracker`. */
  id: string;
  title: string;
  category: MapCategory;
  /**
   * The block component. It is loaded only when the card comes on screen: every block imports ng-mapcn, and the
   * draw block brings terra-draw too, so none of it may reach the chunk of the gallery page itself.
   */
  load: () => Promise<Type<unknown>>;
  codeData: CodeBlockData;
  /** What the card holds open while the block is not on screen, so nothing jumps when it arrives. */
  placeholderClass: string;
}

/**
 * Every gallery block, grouped by category. The components and their highlighted code come from the same source as
 * the docs page, `libs/zard/…/map/demo`, so the two never drift apart.
 */
export const MAPS_REGISTRY: Record<MapCategory, MapBlock[]> = {
  analytics: [
    {
      id: 'analytics-map',
      title: 'Analytics map',
      category: 'analytics',
      load: () =>
        import('@zard/components/map/demo/block-analytics-map').then(m => m.ZardDemoMapBlockAnalyticsMapComponent),
      codeData: MAP_DEMO_BLOCK_ANALYTICS_MAP,
      placeholderClass: 'min-h-[48rem] lg:min-h-[40rem]',
    },
    {
      id: 'analytics-card',
      title: 'Analytics card',
      category: 'analytics',
      load: () =>
        import('@zard/components/map/demo/block-analytics-card').then(m => m.ZardDemoMapBlockAnalyticsCardComponent),
      codeData: MAP_DEMO_BLOCK_ANALYTICS_CARD,
      placeholderClass: 'min-h-[36rem]',
    },
    {
      id: 'choropleth',
      title: 'Choropleth',
      category: 'analytics',
      load: () => import('@zard/components/map/demo/block-choropleth').then(m => m.ZardDemoMapBlockChoroplethComponent),
      codeData: MAP_DEMO_BLOCK_CHOROPLETH,
      placeholderClass: 'min-h-[48rem] lg:min-h-[40rem]',
    },
    {
      id: 'uptime-monitor',
      title: 'Uptime monitor',
      category: 'analytics',
      load: () =>
        import('@zard/components/map/demo/block-uptime-monitor').then(m => m.ZardDemoMapBlockUptimeMonitorComponent),
      codeData: MAP_DEMO_BLOCK_UPTIME_MONITOR,
      placeholderClass: 'min-h-[52rem] lg:min-h-[40rem]',
    },
  ],
  logistics: [
    {
      id: 'delivery-tracker',
      title: 'Delivery tracker',
      category: 'logistics',
      load: () =>
        import('@zard/components/map/demo/block-delivery-tracker').then(
          m => m.ZardDemoMapBlockDeliveryTrackerComponent,
        ),
      codeData: MAP_DEMO_BLOCK_DELIVERY_TRACKER,
      placeholderClass: 'min-h-[60rem] lg:min-h-[34rem]',
    },
    {
      id: 'logistics-network',
      title: 'Logistics network',
      category: 'logistics',
      load: () =>
        import('@zard/components/map/demo/block-logistics-network').then(
          m => m.ZardDemoMapBlockLogisticsNetworkComponent,
        ),
      codeData: MAP_DEMO_BLOCK_LOGISTICS_NETWORK,
      placeholderClass: 'min-h-[56rem] lg:min-h-[40rem]',
    },
    {
      id: 'store-locator',
      title: 'Store locator',
      category: 'logistics',
      load: () =>
        import('@zard/components/map/demo/block-store-locator').then(m => m.ZardDemoMapBlockStoreLocatorComponent),
      codeData: MAP_DEMO_BLOCK_STORE_LOCATOR,
      placeholderClass: 'min-h-[64rem] lg:min-h-[34rem]',
    },
  ],
  data: [
    {
      id: 'heatmap',
      title: 'Heatmap',
      category: 'data',
      load: () => import('@zard/components/map/demo/block-heatmap').then(m => m.ZardDemoMapBlockHeatmapComponent),
      codeData: MAP_DEMO_BLOCK_HEATMAP,
      placeholderClass: 'min-h-[48rem] lg:min-h-[40rem]',
    },
    {
      id: 'clusters',
      title: 'Clusters',
      category: 'data',
      load: () => import('@zard/components/map/demo/block-clusters').then(m => m.ZardDemoMapBlockClustersComponent),
      codeData: MAP_DEMO_BLOCK_CLUSTERS,
      placeholderClass: 'min-h-[52rem] lg:min-h-[40rem]',
    },
    {
      id: 'flights',
      title: 'Arcs and flights',
      category: 'data',
      load: () => import('@zard/components/map/demo/block-flights').then(m => m.ZardDemoMapBlockFlightsComponent),
      codeData: MAP_DEMO_BLOCK_FLIGHTS,
      placeholderClass: 'min-h-[58rem] lg:min-h-[44rem]',
    },
  ],
  '3d': [
    {
      id: 'city-3d',
      title: '3D city',
      category: '3d',
      load: () => import('@zard/components/map/demo/block-city-3d').then(m => m.ZardDemoMapBlockCity3dComponent),
      codeData: MAP_DEMO_BLOCK_CITY_3D,
      placeholderClass: 'min-h-[48rem] lg:min-h-[34rem]',
    },
    {
      id: 'terrain',
      title: 'Terrain',
      category: '3d',
      load: () => import('@zard/components/map/demo/block-terrain').then(m => m.ZardDemoMapBlockTerrainComponent),
      codeData: MAP_DEMO_BLOCK_TERRAIN,
      placeholderClass: 'min-h-[48rem] lg:min-h-[34rem]',
    },
  ],
  draw: [
    {
      id: 'draw',
      title: 'Draw',
      category: 'draw',
      load: () => import('@zard/components/map/demo/block-draw').then(m => m.ZardDemoMapBlockDrawComponent),
      codeData: MAP_DEMO_BLOCK_DRAW,
      placeholderClass: 'min-h-[56rem] lg:min-h-[34rem]',
    },
  ],
};
