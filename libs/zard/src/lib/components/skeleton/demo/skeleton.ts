import { ZardDemoSkeletonCardComponent } from './card';
import { ZardDemoSkeletonDefaultComponent } from './default';

export const SKELETON = {
  componentName: 'skeleton',
  componentType: 'skeleton',
  description: 'Use to show a placeholder while content is loading.',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoSkeletonDefaultComponent,
    },
    {
      name: 'card',
      component: ZardDemoSkeletonCardComponent,
    },
  ],
};
