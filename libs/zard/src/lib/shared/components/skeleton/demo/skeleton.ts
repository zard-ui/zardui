import { SKELETON_DEMO_AVATAR } from '@generated/components/skeleton/demo/avatar';
import { SKELETON_DEMO_CARD } from '@generated/components/skeleton/demo/card';
import { SKELETON_DEMO_DEFAULT } from '@generated/components/skeleton/demo/default';
import { SKELETON_DEMO_FORM } from '@generated/components/skeleton/demo/form';
import { SKELETON_DEMO_TABLE } from '@generated/components/skeleton/demo/table';
import { SKELETON_DEMO_TEXT } from '@generated/components/skeleton/demo/text';
import { SKELETON_CLI_ADD } from '@generated/installation/cli/add-skeleton';
import { SKELETON_MANUAL_CODE } from '@generated/installation/manual/skeleton';
import { SKELETON_USAGE_CODE, SKELETON_USAGE_IMPORT } from '@generated/usage/skeleton';

import { ZardDemoSkeletonAvatarComponent } from './avatar';
import { ZardDemoSkeletonCardComponent } from './card';
import { ZardDemoSkeletonDefaultComponent } from './default';
import { ZardDemoSkeletonFormComponent } from './form';
import { ZardDemoSkeletonTableComponent } from './table';
import { ZardDemoSkeletonTextComponent } from './text';
import { SKELETON_API } from '../doc/api';

export const SKELETON = {
  componentName: 'skeleton',
  componentType: 'skeleton',
  api: SKELETON_API,
  description: 'Use to show a placeholder while content is loading.',
  fullWidth: true,
  installData: {
    cliAdd: SKELETON_CLI_ADD,
    manualCode: SKELETON_MANUAL_CODE,
  },
  usage: { importBlock: SKELETON_USAGE_IMPORT, codeBlock: SKELETON_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSkeletonDefaultComponent,
    column: false,
    codeData: SKELETON_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'avatar',
      component: ZardDemoSkeletonAvatarComponent,
      codeData: SKELETON_DEMO_AVATAR,
    },
    {
      name: 'card',
      component: ZardDemoSkeletonCardComponent,
      codeData: SKELETON_DEMO_CARD,
    },
    {
      name: 'text',
      component: ZardDemoSkeletonTextComponent,
      codeData: SKELETON_DEMO_TEXT,
    },
    {
      name: 'form',
      component: ZardDemoSkeletonFormComponent,
      codeData: SKELETON_DEMO_FORM,
    },
    {
      name: 'table',
      component: ZardDemoSkeletonTableComponent,
      codeData: SKELETON_DEMO_TABLE,
    },
  ],
};
