import { SIDEBAR_DEMO_PREVIEW } from '@generated/components/sidebar/demo/preview';
import { SIDEBAR_CLI_ADD } from '@generated/installation/cli/add-sidebar';
import { SIDEBAR_MANUAL_CODE } from '@generated/installation/manual/sidebar';
import { SIDEBAR_USAGE_CODE, SIDEBAR_USAGE_IMPORT } from '@generated/usage/sidebar';

import { ZardDemoSidebarPreviewComponent } from './preview';
import { SIDEBAR_API } from '../doc/api';

export const SIDEBAR = {
  componentName: 'sidebar',
  componentType: 'sidebar',
  description: 'A composable, themeable and customizable sidebar component.',
  about: {
    description:
      'Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts. This is a solid foundation to build on top of — composable, themeable, customizable.',
    link: { label: 'Browse the Blocks Library', href: '/blocks/sidebar' },
  },
  api: SIDEBAR_API,
  fullWidth: true,
  installData: {
    cliAdd: SIDEBAR_CLI_ADD,
    manualCode: SIDEBAR_MANUAL_CODE,
  },
  usage: { importBlock: SIDEBAR_USAGE_IMPORT, codeBlock: SIDEBAR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSidebarPreviewComponent,
    fullScreen: true,
    codeData: SIDEBAR_DEMO_PREVIEW,
  },
  examples: [],
};
