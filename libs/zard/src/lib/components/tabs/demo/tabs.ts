import { ZardDemoTabsPositiontComponent } from './position';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsArrowComponent } from './arrow';
import { ZardDemoTabsAlignComponent } from './align';

export const TABS = {
  componentName: 'tabs',
  componentType: 'tabs',
  description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
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
