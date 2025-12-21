import { ZardDemoContextMenu } from '@/shared/components/menu/demo/context-menu';

import { ZardDemoMenuDefaultComponent } from './default';

export const MENU = {
  componentName: 'menu',
  componentType: 'menu',
  description: 'A versatile menu component built on top of Angular CDK Menu for creating dropdown and context menus.',
  examples: [
    {
      name: 'default',
      component: ZardDemoMenuDefaultComponent,
    },
    {
      name: 'context-menu',
      component: ZardDemoContextMenu,
    },
  ],
};
