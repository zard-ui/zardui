import {
  login01Block,
  login02Block,
  login03Block,
  login04Block,
  login05Block,
  signup01Block,
  signup02Block,
  signup03Block,
  signup04Block,
  signup05Block,
} from '@blocks';

import type { BlockCategory } from '../services/blocks.service';

/**
 * Registry of all blocks organized by category
 * Import new blocks here and add them to their respective category
 */
export const BLOCKS_REGISTRY: Record<BlockCategory, any[]> = {
  featured: [login01Block, signup01Block],
  sidebar: [],
  login: [login01Block, login02Block, login03Block, login04Block, login05Block],
  signup: [signup01Block, signup02Block, signup03Block, signup04Block, signup05Block],
  otp: [],
  calendar: [],
};
