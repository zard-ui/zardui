import { SEPARATOR_DEMO_LIST } from '@generated/components/separator/demo/list';
import { SEPARATOR_DEMO_MENU } from '@generated/components/separator/demo/menu';
import { SEPARATOR_DEMO_PREVIEW } from '@generated/components/separator/demo/preview';
import { SEPARATOR_DEMO_VERTICAL } from '@generated/components/separator/demo/vertical';
import { SEPARATOR_CLI_ADD } from '@generated/installation/cli/add-separator';
import { SEPARATOR_MANUAL_CODE } from '@generated/installation/manual/separator';
import { SEPARATOR_USAGE_CODE, SEPARATOR_USAGE_IMPORT } from '@generated/usage/separator';

import { ZardDemoSeparatorListComponent } from './list';
import { ZardDemoSeparatorMenuComponent } from './menu';
import { ZardDemoSeparatorPreviewComponent } from './preview';
import { ZardDemoSeparatorVerticalComponent } from './vertical';
import { SEPARATOR_API } from '../doc/api';

export const SEPARATOR = {
  componentName: 'separator',
  componentType: 'separator',
  description: 'Visually or semantically separates content.',
  api: SEPARATOR_API,
  installData: {
    cliAdd: SEPARATOR_CLI_ADD,
    manualCode: SEPARATOR_MANUAL_CODE,
  },
  usage: { importBlock: SEPARATOR_USAGE_IMPORT, codeBlock: SEPARATOR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSeparatorPreviewComponent,
    codeData: SEPARATOR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'vertical',
      component: ZardDemoSeparatorVerticalComponent,
      codeData: SEPARATOR_DEMO_VERTICAL,
    },
    {
      name: 'menu',
      component: ZardDemoSeparatorMenuComponent,
      codeData: SEPARATOR_DEMO_MENU,
    },
    {
      name: 'list',
      component: ZardDemoSeparatorListComponent,
      codeData: SEPARATOR_DEMO_LIST,
    },
  ],
};
