import { ZardDemoTableSimpleComponent } from './simple';
import { ZardDemoTablePaymentsComponent } from './payments';

export const TABLE = {
  componentName: 'table',
  componentType: 'table',
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
