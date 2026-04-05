import { BUTTON_DEMO_DEFAULT } from '@generated/components/button/demo/default';
import { BUTTON_DEMO_FULL } from '@generated/components/button/demo/full';
import { BUTTON_DEMO_LOADING } from '@generated/components/button/demo/loading';
import { BUTTON_DEMO_SHAPE } from '@generated/components/button/demo/shape';
import { BUTTON_DEMO_SIZE } from '@generated/components/button/demo/size';
import { BUTTON_DEMO_TYPE } from '@generated/components/button/demo/type';
import { BUTTON_CLI_ADD } from '@generated/installation/cli/add-button';
import { BUTTON_MANUAL_CODE } from '@generated/installation/manual/button';
import { BUTTON_USAGE_IMPORT, BUTTON_USAGE_CODE } from '@generated/usage/button';

import { ZardDemoButtonDefaultComponent } from './default';
import { ZardDemoButtonFullComponent } from './full';
import { ZardDemoButtonLoadingComponent } from './loading';
import { ZardDemoButtonShapeComponent } from './shape';
import { ZardDemoButtonSizeComponent } from './size';
import { ZardDemoButtonTypeComponent } from './type';
import { BUTTON_API } from '../doc/api';

export const BUTTON = {
  api: BUTTON_API,
  componentName: 'button',
  componentType: 'button',
  description: 'Displays a button or a component that looks like a button.',
  installData: {
    cliAdd: BUTTON_CLI_ADD,
    manualCode: BUTTON_MANUAL_CODE,
  },
  usage: { importBlock: BUTTON_USAGE_IMPORT, codeBlock: BUTTON_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoButtonDefaultComponent,
      codeData: BUTTON_DEMO_DEFAULT,
    },
    {
      name: 'type',
      component: ZardDemoButtonTypeComponent,
      codeData: BUTTON_DEMO_TYPE,
    },
    {
      name: 'size',
      component: ZardDemoButtonSizeComponent,
      codeData: BUTTON_DEMO_SIZE,
    },
    {
      name: 'shape',
      component: ZardDemoButtonShapeComponent,
      codeData: BUTTON_DEMO_SHAPE,
    },
    {
      name: 'full',
      component: ZardDemoButtonFullComponent,
      codeData: BUTTON_DEMO_FULL,
    },
    {
      name: 'loading',
      component: ZardDemoButtonLoadingComponent,
      codeData: BUTTON_DEMO_LOADING,
    },
  ],
};
