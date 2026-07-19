import { CAROUSEL_DEMO_ORIENTATION } from '@generated/components/carousel/demo/orientation';
import { CAROUSEL_DEMO_PREVIEW } from '@generated/components/carousel/demo/preview';
import { CAROUSEL_DEMO_SIZES } from '@generated/components/carousel/demo/sizes';
import { CAROUSEL_DEMO_SPACING } from '@generated/components/carousel/demo/spacing';
import {
  CAROUSEL_SNIPPET_ORIENTATION,
  CAROUSEL_SNIPPET_SIZES_RESPONSIVE,
  CAROUSEL_SNIPPET_SIZES_THIRDS,
  CAROUSEL_SNIPPET_SPACING_DEFAULT,
  CAROUSEL_SNIPPET_SPACING_RESPONSIVE,
} from '@generated/components/carousel/snippets';
import { CAROUSEL_CLI_ADD } from '@generated/installation/cli/add-carousel';
import { CAROUSEL_MANUAL_CODE } from '@generated/installation/manual/carousel';
import { CAROUSEL_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-carousel';
import { CAROUSEL_USAGE_IMPORT, CAROUSEL_USAGE_CODE } from '@generated/usage/carousel';

import { ZardDemoCarouselOrientationComponent } from '@/shared/components/carousel/demo/orientation';
import { ZardDemoCarouselPreviewComponent } from '@/shared/components/carousel/demo/preview';
import { ZardDemoCarouselSizeComponent } from '@/shared/components/carousel/demo/sizes';
import { ZardDemoCarouselSpacingComponent } from '@/shared/components/carousel/demo/spacing';

import { CAROUSEL_API } from '../doc/api';

export const CAROUSEL = {
  api: CAROUSEL_API,
  componentName: 'carousel',
  componentType: 'carousel',
  description: 'A carousel with motion and swipe built using Embla.',
  about: {
    description: 'The carousel is built using the Embla Carousel library.',
    link: { label: 'Embla Carousel', href: 'https://www.embla-carousel.com/' },
  },
  installData: {
    cliAdd: CAROUSEL_CLI_ADD,
    manualCode: CAROUSEL_MANUAL_CODE,
    manualDeps: CAROUSEL_MANUAL_INSTALL_DEPS,
  },
  usage: { importBlock: CAROUSEL_USAGE_IMPORT, codeBlock: CAROUSEL_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCarouselPreviewComponent,
    column: false,
    codeData: CAROUSEL_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'sizes',
      description: 'To set the size of the items, you can use the `basis` utility class on the `<z-carousel-item />`.',
      component: ZardDemoCarouselSizeComponent,
      codeData: CAROUSEL_DEMO_SIZES,
      codeAfter: [{ codeData: CAROUSEL_SNIPPET_SIZES_THIRDS }, { codeData: CAROUSEL_SNIPPET_SIZES_RESPONSIVE }],
    },
    {
      name: 'spacing',
      description:
        'To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<z-carousel-item />` and a negative `-ml-[VALUE]` on the `<z-carousel-content />`.',
      component: ZardDemoCarouselSpacingComponent,
      codeData: CAROUSEL_DEMO_SPACING,
      codeAfter: [{ codeData: CAROUSEL_SNIPPET_SPACING_DEFAULT }, { codeData: CAROUSEL_SNIPPET_SPACING_RESPONSIVE }],
    },
    {
      name: 'orientation',
      description: 'Use the `zOrientation` input to set the orientation of the carousel.',
      component: ZardDemoCarouselOrientationComponent,
      codeData: CAROUSEL_DEMO_ORIENTATION,
      previewHeight: '34rem',
      codeAfter: { codeData: CAROUSEL_SNIPPET_ORIENTATION },
    },
  ],
};
