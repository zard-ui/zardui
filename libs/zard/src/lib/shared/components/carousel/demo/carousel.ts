import { CAROUSEL_DEMO_API_DEMO } from '@generated/components/carousel/demo/api-demo';
import { CAROUSEL_DEMO_DEFAULT } from '@generated/components/carousel/demo/default';
import { CAROUSEL_DEMO_DOT_CONTROLS } from '@generated/components/carousel/demo/dot-controls';
import { CAROUSEL_DEMO_ORIENTATION } from '@generated/components/carousel/demo/orientation';
import { CAROUSEL_DEMO_PLUGINS } from '@generated/components/carousel/demo/plugins';
import { CAROUSEL_DEMO_SIZES } from '@generated/components/carousel/demo/sizes';
import { CAROUSEL_DEMO_SPACING } from '@generated/components/carousel/demo/spacing';
import { CAROUSEL_CLI_ADD } from '@generated/installation/cli/add-carousel';
import { CAROUSEL_MANUAL_CODE } from '@generated/installation/manual/carousel';
import { CAROUSEL_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-carousel';
import { CAROUSEL_USAGE_IMPORT, CAROUSEL_USAGE_CODE } from '@generated/usage/carousel';

import { ZardDemoCarouselApiComponent } from '@/shared/components/carousel/demo/api-demo';
import { ZardDemoCarouselDefaultComponent } from '@/shared/components/carousel/demo/default';
import { ZardDemoCarouselDotControlsComponent } from '@/shared/components/carousel/demo/dot-controls';
import { ZardDemoCarouselOrientationComponent } from '@/shared/components/carousel/demo/orientation';
import { ZardDemoCarouselPluginsComponent } from '@/shared/components/carousel/demo/plugins';
import { ZardDemoCarouselSizeComponent } from '@/shared/components/carousel/demo/sizes';
import { ZardDemoCarouselSpacingComponent } from '@/shared/components/carousel/demo/spacing';

import { CAROUSEL_API } from '../doc/api';

export const CAROUSEL = {
  api: CAROUSEL_API,
  componentName: 'carousel',
  componentType: 'carousel',
  description:
    'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback',
  installData: {
    cliAdd: CAROUSEL_CLI_ADD,
    manualCode: CAROUSEL_MANUAL_CODE,
    manualDeps: CAROUSEL_MANUAL_INSTALL_DEPS,
  },
  usage: { importBlock: CAROUSEL_USAGE_IMPORT, codeBlock: CAROUSEL_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoCarouselDefaultComponent,
      codeData: CAROUSEL_DEMO_DEFAULT,
    },
    {
      name: 'dot-controls',
      component: ZardDemoCarouselDotControlsComponent,
      codeData: CAROUSEL_DEMO_DOT_CONTROLS,
    },
    {
      name: 'orientation',
      component: ZardDemoCarouselOrientationComponent,
      codeData: CAROUSEL_DEMO_ORIENTATION,
    },
    {
      name: 'sizes',
      description: 'To set the size of the items, you can use the `basis` utility class on the `<z-carousel-item />`.',
      component: ZardDemoCarouselSizeComponent,
      codeData: CAROUSEL_DEMO_SIZES,
    },
    {
      name: 'spacing',
      description:
        'To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<z-carousel-item />` and a negative `-ml-[VALUE]` on the `<z-carousel-content />`.',
      component: ZardDemoCarouselSpacingComponent,
      codeData: CAROUSEL_DEMO_SPACING,
    },
    {
      name: 'api-demo',
      component: ZardDemoCarouselApiComponent,
      codeData: CAROUSEL_DEMO_API_DEMO,
    },
    {
      name: 'plugins',
      component: ZardDemoCarouselPluginsComponent,
      codeData: CAROUSEL_DEMO_PLUGINS,
    },
  ],
};
