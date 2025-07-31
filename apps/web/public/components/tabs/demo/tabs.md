```angular-ts showLineNumbers
import { ZardDemoTabsPositiontComponent } from './position';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsArrowComponent } from './arrow';
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

```