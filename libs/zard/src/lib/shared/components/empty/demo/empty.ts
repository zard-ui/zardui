import { EMPTY_DEMO_ADVANCED } from '@generated/components/empty/demo/advanced';
import { EMPTY_DEMO_CUSTOM_IMAGE } from '@generated/components/empty/demo/custom-image';
import { EMPTY_DEMO_DEFAULT } from '@generated/components/empty/demo/default';
import { EMPTY_CLI_ADD } from '@generated/installation/cli/add-empty';
import { EMPTY_MANUAL_CODE } from '@generated/installation/manual/empty';

import { ZardDemoEmptyAdvancedComponent } from './advanced';
import { ZardDemoEmptyCustomImageComponent } from './custom-image';
import { ZardDemoEmptyDefaultComponent } from './default';
import { EMPTY_API } from '../doc/api';

export const EMPTY = {
  componentName: 'empty',
  componentPath: 'empty',
  description: 'Use the Empty component to display a empty state.',
  api: EMPTY_API,
  installData: {
    cliAdd: EMPTY_CLI_ADD,
    manualCode: EMPTY_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoEmptyDefaultComponent,
      codeData: EMPTY_DEMO_DEFAULT,
    },
    {
      name: 'custom-image',
      component: ZardDemoEmptyCustomImageComponent,
      codeData: EMPTY_DEMO_CUSTOM_IMAGE,
    },
    {
      name: 'advanced',
      component: ZardDemoEmptyAdvancedComponent,
      codeData: EMPTY_DEMO_ADVANCED,
    },
  ],
};
