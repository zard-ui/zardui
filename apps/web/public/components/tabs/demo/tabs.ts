import { ZardDemoTabsPositiontComponent } from './position';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsAlignComponent } from './align';

export const TABS = {
  componentName: 'tabs',
  componentType: 'tabs',
  examples: [
    {
      name: 'default',
      component: ZardDemoTabsDefaultComponent,
    },
    {
      name: 'tab position and active position',
      component: ZardDemoTabsPositiontComponent,
    },
    {
      name: 'tab align',
      component: ZardDemoTabsAlignComponent,
    },
  ],
};
