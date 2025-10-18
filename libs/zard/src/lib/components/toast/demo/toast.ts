import { ZardDemoToastDestructiveComponent } from './destructive';
import { ZardDemoToastPositionComponent } from './position';
import { ZardDemoToastAdvancedComponent } from './advanced';
import { ZardDemoToastSuccessComponent } from './success';
import { ZardDemoToastLoadingComponent } from './loading';
import { ZardDemoToastDefaultComponent } from './default';

export const TOAST = {
  componentName: 'toast',
  componentType: 'toast',
  description: 'A succinct message that is displayed temporarily.',
  examples: [
    {
      name: 'default',
      component: ZardDemoToastDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoToastDestructiveComponent,
    },
    {
      name: 'success',
      component: ZardDemoToastSuccessComponent,
    },
    {
      name: 'loading',
      component: ZardDemoToastLoadingComponent,
    },
    {
      name: 'advanced',
      component: ZardDemoToastAdvancedComponent,
    },
    {
      name: 'position',
      component: ZardDemoToastPositionComponent,
    },
  ],
};
