import { DefaultScrollToTopDemoComponent } from './default';
import { ZardDemoScrollToTopSizesComponent } from './sizes';
import { ZardDemoScrollToTopVariantsComponent } from './variants';

export const SCROLL_TO_TOP = {
  componentName: 'scroll-to-top',
  componentType: 'scroll-to-top',
  description: 'A floating button that appears when scrolling and smoothly scrolls back to the top.',
  examples: [
    {
      name: 'default',
      component: DefaultScrollToTopDemoComponent,
    },
    {
      name: 'variants',
      component: ZardDemoScrollToTopVariantsComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoScrollToTopSizesComponent,
    },
  ],
};
