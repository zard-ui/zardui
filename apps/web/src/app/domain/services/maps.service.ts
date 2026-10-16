import { Injectable } from '@angular/core';

import { MAPS_REGISTRY, type MapBlock } from '../config/maps-registry';

export type MapCategory = 'analytics' | 'logistics' | 'data' | '3d' | 'draw';

export const MAP_CATEGORIES: MapCategory[] = ['analytics', 'logistics', 'data', '3d', 'draw'];

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  /**
   * Get every block of a category, in registry order.
   */
  getBlocksByCategory(category: MapCategory): MapBlock[] {
    return MAPS_REGISTRY[category] ?? [];
  }

  /**
   * Get every block from every category.
   */
  getAllBlocks(): MapBlock[] {
    return MAP_CATEGORIES.flatMap(category => this.getBlocksByCategory(category));
  }

  /**
   * Narrows an arbitrary route parameter to a known category.
   */
  isMapCategory(value: string | null | undefined): value is MapCategory {
    return !!value && (MAP_CATEGORIES as string[]).includes(value);
  }
}
