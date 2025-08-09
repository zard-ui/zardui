import { ZardDemoPaginationCustomComponent } from './custom';
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
      name: 'custom',
      component: ZardDemoPaginationCustomComponent,
    },
  ],
};
