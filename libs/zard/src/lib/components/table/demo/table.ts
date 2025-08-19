import { ZardDemoTableBasicComponent } from './basic';
import { ZardDemoTablePaymentsComponent } from './payments';
import { ZardDemoTableSimpleComponent } from './simple';

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
    {
      name: 'basic',
      component: ZardDemoTableBasicComponent,
    },
  ],
};
