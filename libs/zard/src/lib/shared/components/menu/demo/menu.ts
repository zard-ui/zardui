import { MENU_DEMO_CONTEXT_MENU } from '@generated/components/menu/demo/context-menu';
import { MENU_DEMO_DEFAULT } from '@generated/components/menu/demo/default';
import { MENU_CLI_ADD } from '@generated/installation/cli/add-menu';
import { MENU_MANUAL_CODE } from '@generated/installation/manual/menu';

import { ZardDemoContextMenu } from '@/shared/components/menu/demo/context-menu';

import { ZardDemoMenuDefaultComponent } from './default';
import { MENU_API } from '../doc/api';

export const MENU = {
  componentName: 'menu',
  componentType: 'menu',
  description: 'A versatile menu component built on top of Angular CDK Menu for creating dropdown and context menus.',
  api: MENU_API,
  installData: {
    cliAdd: MENU_CLI_ADD,
    manualCode: MENU_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoMenuDefaultComponent,
      codeData: MENU_DEMO_DEFAULT,
    },
    {
      name: 'context-menu',
      component: ZardDemoContextMenu,
      codeData: MENU_DEMO_CONTEXT_MENU,
    },
  ],
};
