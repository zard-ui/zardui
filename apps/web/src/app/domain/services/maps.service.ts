import { Injectable } from '@angular/core';

import { MAP_BLOCKS, type MapBlock } from '../config/maps-registry';

export type MapCategory = 'analytics' | 'logistics' | 'data' | '3d' | 'draw';

/** The groups the blocks fall into: one tab and one page (`/maps`, `/maps/<category>`) each. The first is `/maps`. */
export const MAP_CATEGORIES: { id: MapCategory; label: string }[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'data', label: 'Data' },
  { id: '3d', label: '3D' },
  { id: 'draw', label: 'Draw' },
];

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  /**
   * Every block, in the order the page lists them.
   */
  getAllBlocks(): MapBlock[] {
    return MAP_BLOCKS;
  }

  /**
   * The blocks of one category, in the order the page lists them.
   */
  getBlocksByCategory(category: MapCategory): MapBlock[] {
    return MAP_BLOCKS.filter(block => block.category === category);
  }

  /**
   * Narrows an arbitrary route parameter to a known category.
   */
  isMapCategory(value: string | null | undefined): value is MapCategory {
    return !!value && MAP_CATEGORIES.some(category => category.id === value);
  }
}
