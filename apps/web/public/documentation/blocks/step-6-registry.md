```typescript title="apps/web/src/app/domain/config/blocks-registry.ts" copyButton showLineNumbers
import { myBlock } from '@blocks/my-block/block';

export const BLOCKS_REGISTRY: Record<BlockCategory, Block[]> = {
  featured: [dashboard01Block],
  dashboard: [myBlock], // Add to appropriate category
  sidebar: [],
  login: [],
  signup: [],
  otp: [],
  calendar: [],
};
```
