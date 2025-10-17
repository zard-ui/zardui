import type { BlockCategory } from '../services/blocks.service';
import { authentication01Block } from '@blocks';

/**
 * Registry of all blocks organized by category
 * Import new blocks here and add them to their respective category
 */
export const BLOCKS_REGISTRY: Record<BlockCategory, any[]> = {
  featured: [authentication01Block],
  dashboard: [],
  sidebar: [],
  login: [authentication01Block],
  signup: [],
  otp: [],
  calendar: [],
};
