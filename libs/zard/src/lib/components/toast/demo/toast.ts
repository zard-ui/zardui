import { ZardDemoToastAdvancedComponent } from './advanced';
import { ZardDemoToastDefaultComponent } from './default';
import { ZardDemoToastDestructiveComponent } from './destructive';
import { ZardDemoToastLoadingComponent } from './loading';
import { ZardDemoToastPositionComponent } from './position';
import { ZardDemoToastSuccessComponent } from './success';

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
