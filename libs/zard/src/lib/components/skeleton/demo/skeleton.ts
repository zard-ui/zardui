import { ZardDemoSkeletonCardComponent } from './card';
import { ZardDemoSkeletonComponent } from './default';

export const SKELETON = {
  componentName: 'skeleton',
  componentType: 'skeleton',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoSkeletonComponent,
    },
    {
      name: 'card',
      component: ZardDemoSkeletonCardComponent,
    },
  ],
};
