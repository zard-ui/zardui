import { ZardDemoTabsAlignComponent } from './align';
import { ZardDemoTabsArrowComponent } from './arrow';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsPositiontComponent } from './position';

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
    {
      name: 'tab arrow',
      component: ZardDemoTabsArrowComponent,
    },
  ],
};
