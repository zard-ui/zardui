import { Injectable } from '@angular/core';
import type { Block } from '../components/block-container/block-container.component';
import { BLOCKS_REGISTRY } from '../config/blocks-registry';

export type BlockCategory = 'featured' | 'sidebar' | 'login' | 'signup' | 'otp' | 'calendar' | 'dashboard';

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  private blocks: Map<BlockCategory, Block[]> = new Map();

  constructor() {
    this.initializeBlocks();
  }

  /**
   * Register a block in a specific category
   */
  registerBlock(category: BlockCategory, block: Block): void {
    const categoryBlocks = this.blocks.get(category) || [];
    categoryBlocks.push(block);
    this.blocks.set(category, categoryBlocks);
  }

  /**
   * Get all blocks for a specific category
   */
  getBlocksByCategory(category: BlockCategory): Block[] {
    return this.blocks.get(category) || [];
  }

  /**
   * Get all blocks from all categories
   */
  getAllBlocks(): Block[] {
    const allBlocks: Block[] = [];
    this.blocks.forEach(blocks => allBlocks.push(...blocks));
    return allBlocks;
  }

  /**
   * Get all available categories
   */
  getCategories(): BlockCategory[] {
    return Array.from(this.blocks.keys());
  }

  /**
   * Initialize blocks from block definitions
   */
  private initializeBlocks(): void {
    // Register all blocks from the registry
    Object.entries(BLOCKS_REGISTRY).forEach(([category, blocks]) => {
      blocks.forEach(block => {
        this.registerBlock(category as BlockCategory, block);
      });
    });
  }
}
