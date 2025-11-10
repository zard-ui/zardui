import { ZardDemoTabsAlignComponent } from './align';
import { ZardDemoTabsArrowComponent } from './arrow';
import { ZardDemoTabsDefaultComponent } from './default';
import { ZardDemoTabsPositionComponent } from './position';

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
      component: ZardDemoTabsPositionComponent,
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
