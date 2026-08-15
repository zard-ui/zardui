/** Keys of `BLOCKS_REGISTRY` — kept in sync with `BlockCategory` in blocks.service.ts. */
export type BlockRegistryCategory = 'featured' | 'sidebar' | 'login' | 'signup' | 'otp' | 'calendar';

export interface BlockGeneratorSchema {
  name: string;
  description: string;
  /** Registry bucket the block is listed under. */
  category?: BlockRegistryCategory;
  /** Display title shown on the block card. */
  title?: string;
  /** Display label stored in `Block.category` (e.g. 'Authentication'). */
  label?: string;
}
