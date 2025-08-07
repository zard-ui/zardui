import { ZardDemoPaginationBasicComponent } from './basic';
import { ZardDemoPaginationComponent } from './default';

export const PAGINATION = {
  componentName: 'pagination',
  componentType: 'pagination',
  examples: [
    {
      name: 'default',
      component: ZardDemoPaginationComponent,
    },
    {
      name: 'basic',
      component: ZardDemoPaginationBasicComponent,
    },
  ],
};
