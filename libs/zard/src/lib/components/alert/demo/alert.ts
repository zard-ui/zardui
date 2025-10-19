import { ZardDemoAlertWarningComponent } from './warning';
import { ZardDemoAlertSuccessComponent } from './success';
import { ZardDemoAlertDefaultComponent } from './default';
import { ZardDemoAlertErrorComponent } from './error';
import { ZardDemoAlertBasicComponent } from './basic';
import { ZardDemoAlertInfoComponent } from './info';

export const ALERT = {
  componentName: 'alert',
  componentType: 'alert',
  description: 'Displays a callout for user attention.',
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
