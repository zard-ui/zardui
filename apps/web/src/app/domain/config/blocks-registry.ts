import { authentication01Block } from '@blocks';

import type { BlockCategory } from '../services/blocks.service';

export const BLOCKS_REGISTRY: Record<BlockCategory, any[]> = {
  featured: [authentication01Block],
  sidebar: [],
  login: [authentication01Block],
  signup: [],
  otp: [],
  calendar: [],
};
