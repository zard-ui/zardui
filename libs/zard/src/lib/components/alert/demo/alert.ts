import { ZardDemoAlertAppearanceComponent } from './appearance';
import { ZardDemoAlertBasicComponent } from './basic';

export const ALERT = {
  componentName: 'alert',
  componentType: 'alert',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAlertBasicComponent,
    },
    {
      name: 'appearance',
      component: ZardDemoAlertAppearanceComponent,
      column: true,
    },
  ],
};
