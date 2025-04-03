import { ZardDemoTabsAlignComponent } from './align';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsPositiontComponent } from './position';

export const TABS = {
  componentName: 'tabs',
  componentType: 'tabs',
  examples: [
    {
      name: 'default',
      component: ZardDemoTabsDefaultComponent,
      isDefineSizeContainer: true,
    },
    {
      name: 'tab position and active position',
      component: ZardDemoTabsPositiontComponent,
      isDefineSizeContainer: true,
    },
    {
      name: 'tab align',
      component: ZardDemoTabsAlignComponent,
      isDefineSizeContainer: true,
    },
  ],
};
