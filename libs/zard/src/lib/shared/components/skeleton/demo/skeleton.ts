import { SKELETON_DEMO_CARD } from '@generated/components/skeleton/demo/card';
import { SKELETON_DEMO_DEFAULT } from '@generated/components/skeleton/demo/default';
import { SKELETON_CLI_ADD } from '@generated/installation/cli/add-skeleton';
import { SKELETON_MANUAL_CODE } from '@generated/installation/manual/skeleton';

import { ZardDemoSkeletonCardComponent } from './card';
import { ZardDemoSkeletonDefaultComponent } from './default';
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
  examples: [
    {
      name: 'default',
      component: ZardDemoSkeletonDefaultComponent,
      codeData: SKELETON_DEMO_DEFAULT,
    },
    {
      name: 'card',
      component: ZardDemoSkeletonCardComponent,
      codeData: SKELETON_DEMO_CARD,
    },
  ],
};
