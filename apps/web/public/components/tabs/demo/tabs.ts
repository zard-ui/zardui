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
      name: 'position',
      component: ZardDemoTabsPositiontComponent,
    },
    {
      name: 'align',
      component: ZardDemoTabsAlignComponent,
    },
    {
      name: 'arrow',
      component: ZardDemoTabsArrowComponent,
    },
  ],
};
