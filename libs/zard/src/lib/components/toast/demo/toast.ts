import { ZardDemoToastDefaultComponent } from './default';
import { ZardDemoToastDestructiveComponent } from './destructive';
import { ZardDemoToastSuccessComponent } from './success';
import { ZardDemoToastLoadingComponent } from './loading';
import { ZardDemoToastAdvancedComponent } from './advanced';
import { ZardDemoToastPositionComponent } from './position';

export const TOAST = {
  componentName: 'toast',
  componentType: 'toast',
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
