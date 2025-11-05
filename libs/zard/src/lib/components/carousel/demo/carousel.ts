import { ZardDemoCarouselApiComponent } from './api-demo';
import { ZardDemoCarouselDefaultComponent } from './default';
import { ZardDemoCarouselOrientationComponent } from './orientation';
import { ZardDemoCarouselPluginsComponent } from './plugins';
import { ZardDemoCarouselSizeComponent } from './size';
import { ZardDemoCarouselSpacingComponent } from './spacing';

export const CAROUSEL = {
  componentName: 'carousel',
  componentType: 'carousel',
  description: 'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback',
  examples: [
    {
      name: 'default',
      component: ZardDemoCarouselDefaultComponent,
    },
    {
      name: 'orientation',
      component: ZardDemoCarouselOrientationComponent,
    },
    {
      name: 'size',
      component: ZardDemoCarouselSizeComponent,
    },
    {
      name: 'spacing',
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
