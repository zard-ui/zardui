import { LOADER_DEMO_DEFAULT } from '@generated/components/loader/demo/default';
import { LOADER_DEMO_SIZE } from '@generated/components/loader/demo/size';
import { LOADER_CLI_ADD } from '@generated/installation/cli/add-loader';
import { LOADER_MANUAL_CODE } from '@generated/installation/manual/loader';

import { ZardDemoLoaderDefaultComponent } from './default';
import { ZardDemoLoaderSizeComponent } from './size';

export const LOADER = {
  componentName: 'loader',
  componentType: 'loader',
  description:
    'The Loader is a visual component that displays a loading animation to indicate that an action or process is in progress.',
  installData: {
    cliAdd: LOADER_CLI_ADD,
    manualCode: LOADER_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoLoaderDefaultComponent,
      codeData: LOADER_DEMO_DEFAULT,
    },
    {
      name: 'size',
      component: ZardDemoLoaderSizeComponent,
      codeData: LOADER_DEMO_SIZE,
    },
  ],
};
