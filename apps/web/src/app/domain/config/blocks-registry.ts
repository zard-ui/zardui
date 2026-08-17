import {
  login01Block,
  login02Block,
  login03Block,
  login04Block,
  login05Block,
  sidebar01Block,
  sidebar02Block,
  sidebar03Block,
  sidebar04Block,
  sidebar05Block,
  sidebar06Block,
  sidebar07Block,
  sidebar08Block,
  sidebar09Block,
  sidebar10Block,
  sidebar11Block,
  sidebar12Block,
  sidebar13Block,
  sidebar14Block,
  sidebar15Block,
  sidebar16Block,
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
  // The block generator adds every new block to `featured`. With 16 sidebars that would bury the
  // landing page, so only the most representative one stays here — all 16 live under `sidebar`.
  featured: [login01Block, signup01Block, sidebar07Block],
  sidebar: [
    sidebar01Block,
    sidebar02Block,
    sidebar03Block,
    sidebar04Block,
    sidebar05Block,
    sidebar06Block,
    sidebar07Block,
    sidebar08Block,
    sidebar09Block,
    sidebar10Block,
    sidebar11Block,
    sidebar12Block,
    sidebar13Block,
    sidebar14Block,
    sidebar15Block,
    sidebar16Block,
  ],
  login: [login01Block, login02Block, login03Block, login04Block, login05Block],
  signup: [signup01Block, signup02Block, signup03Block, signup04Block, signup05Block],
  otp: [],
  calendar: [],
};
