import { ZardDemoPaginationCustomComponent } from './custom';
import { ZardDemoPaginationDefaultComponent } from './default';

export const PAGINATION = {
  componentName: 'pagination',
  componentType: 'pagination',
  description: 'Pagination with page navigation, next and previous links.',
  examples: [
    {
      name: 'default',
      component: ZardDemoPaginationDefaultComponent,
    },
    {
      name: 'custom',
      component: ZardDemoPaginationCustomComponent,
    },
  ],
};
