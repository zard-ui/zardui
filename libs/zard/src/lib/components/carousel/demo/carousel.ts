import { ZardDemoCarouselOrientationComponent } from './orientation';
import { ZardDemoCarouselMultipleComponent } from './multiple';
import { ZardDemoCarouselSpacingComponent } from './spacing';
import { ZardDemoCarouselPluginsComponent } from './plugins';
import { ZardDemoCarouselDefaultComponent } from './default';
import { ZardDemoCarouselThumbsComponent } from './thumbs';
import { ZardDemoCarouselApiComponent } from './api-demo';
import { ZardDemoCarouselSizeComponent } from './size';

export const CAROUSEL = {
  componentName: 'carousel',
  componentType: 'carousel',
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
      name: 'multiple',
      component: ZardDemoCarouselMultipleComponent,
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
    {
      name: 'thumbs',
      component: ZardDemoCarouselThumbsComponent,
    },
  ],
};
