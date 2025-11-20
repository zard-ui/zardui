import { ZardDemoCarouselApiComponent } from './api-demo';
import { ZardDemoCarouselDefaultComponent } from './default';
import { ZardDemoCarouselDotControlsComponent } from './dot-controls';
import { ZardDemoCarouselOrientationComponent } from './orientation';
import { ZardDemoCarouselPluginsComponent } from './plugins';
import { ZardDemoCarouselSizeComponent } from './size';
import { ZardDemoCarouselSpacingComponent } from './spacing';

export const CAROUSEL = {
  componentName: 'carousel',
  componentType: 'carousel',
  description:
    'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback',
  examples: [
    {
      name: 'default',
      component: ZardDemoCarouselDefaultComponent,
    },
    {
      name: 'dot-controls',
      component: ZardDemoCarouselDotControlsComponent,
    },
    {
      name: 'orientation',
      component: ZardDemoCarouselOrientationComponent,
    },
    {
      name: 'sizes',
      description: 'To set the size of the items, you can use the `basis` utility class on the `<z-carousel-item />`.',
      component: ZardDemoCarouselSizeComponent,
    },
    {
      name: 'spacing',
      description:
        'To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<z-carousel-item />` and a negative `-ml-[VALUE]` on the `<z-carousel-content />`.',
      component: ZardDemoCarouselSpacingComponent,
    },
    {
      name: 'api-demo',
      component: ZardDemoCarouselApiComponent,
    },
    {
      name: 'plugins',
      component: ZardDemoCarouselPluginsComponent,
    },
  ],
};
