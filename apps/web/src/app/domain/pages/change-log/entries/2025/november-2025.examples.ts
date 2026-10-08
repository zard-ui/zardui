import { CAROUSEL_DEMO_PREVIEW } from '@generated/components/carousel/demo/preview';
import { KBD_DEMO_PREVIEW } from '@generated/components/kbd/demo/preview';
import { CAROUSEL_CLI_ADD } from '@generated/installation/cli/add-carousel';
import { KBD_CLI_ADD } from '@generated/installation/cli/add-kbd';

import { ZardDemoCarouselPreviewComponent } from '@zard/components/carousel/demo/preview';
import { ZardDemoKbdPreviewComponent } from '@zard/components/kbd/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const NOVEMBER_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description:
      'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback.',
    component: ZardDemoCarouselPreviewComponent,
    componentName: 'carousel',
    codeData: CAROUSEL_DEMO_PREVIEW,
    cliAdd: CAROUSEL_CLI_ADD,
  },
  {
    name: 'preview',
    description: 'Display keyboard keys and shortcuts in a visually consistent way.',
    component: ZardDemoKbdPreviewComponent,
    componentName: 'kbd',
    codeData: KBD_DEMO_PREVIEW,
    cliAdd: KBD_CLI_ADD,
  },
];
