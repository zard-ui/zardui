```angular-ts showLineNumbers
import { ZardDemoAlertBasicComponent } from './basic';
import { ZardDemoAlertDefaultComponent } from './default';
import { ZardDemoAlertErrorComponent } from './error';
import { ZardDemoAlertInfoComponent } from './info';
import { ZardDemoAlertSuccessComponent } from './success';
import { ZardDemoAlertWarningComponent } from './warning';

export const ALERT = {
  componentName: 'alert',
  componentType: 'alert',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAlertBasicComponent,
    },
    {
      name: 'default',
      component: ZardDemoAlertDefaultComponent,
      column: true,
    },
    {
      name: 'info',
      component: ZardDemoAlertInfoComponent,
      column: true,
    },
    {
      name: 'success',
      component: ZardDemoAlertSuccessComponent,
      column: true,
    },
    {
      name: 'warning',
      component: ZardDemoAlertWarningComponent,
      column: true,
    },
    {
      name: 'error',
      component: ZardDemoAlertErrorComponent,
      column: true,
    },
  ],
};

```