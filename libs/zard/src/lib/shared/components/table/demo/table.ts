import { ZardDemoTablePaymentsComponent } from './payments';
import { ZardDemoTableSimpleComponent } from './simple';

export const TABLE = {
  componentName: 'table',
  componentType: 'table',
  description: 'Displays data in a structured table format with styling variants and semantic HTML structure.',
  examples: [
    {
      name: 'simple',
      component: ZardDemoTableSimpleComponent,
    },
    {
      name: 'payments',
      component: ZardDemoTablePaymentsComponent,
    },
  ],
};
