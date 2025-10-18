import { ZardDemoPaginationCustomComponent } from './custom';
import { ZardDemoPaginationComponent } from './default';

export const PAGINATION = {
  componentName: 'pagination',
  componentType: 'pagination',
  description: 'Pagination with page navigation, next and previous links.',
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
