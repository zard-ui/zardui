import { INPUT_DEMO_BORDERLESS } from '@generated/components/input/demo/borderless';
import { INPUT_DEMO_DEFAULT } from '@generated/components/input/demo/default';
import { INPUT_DEMO_SIZE } from '@generated/components/input/demo/size';
import { INPUT_DEMO_STATUS } from '@generated/components/input/demo/status';
import { INPUT_DEMO_TEXT_AREA } from '@generated/components/input/demo/text-area';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';
import { INPUT_MANUAL_CODE } from '@generated/installation/manual/input';
import { INPUT_USAGE_IMPORT, INPUT_USAGE_CODE } from '@generated/usage/input';

import { ZardDemoInputBorderlessComponent } from './borderless';
import { ZardDemoInputDefaultComponent } from './default';
import { ZardDemoInputSizeComponent } from './size';
import { ZardDemoInputStatusComponent } from './status';
import { ZardDemoInputTextAreaComponent } from './text-area';
import { INPUT_API } from '../doc/api';

export const INPUT = {
  componentName: 'input',
  componentType: 'input',
  description: 'Displays a form input field or a component that looks like an input field.',
  api: INPUT_API,
  installData: {
    cliAdd: INPUT_CLI_ADD,
    manualCode: INPUT_MANUAL_CODE,
  },
  usage: { importBlock: INPUT_USAGE_IMPORT, codeBlock: INPUT_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoInputDefaultComponent,
      column: true,
      codeData: INPUT_DEMO_DEFAULT,
    },
    {
      name: 'size',
      component: ZardDemoInputSizeComponent,
      column: true,
      codeData: INPUT_DEMO_SIZE,
    },
    {
      name: 'status',
      component: ZardDemoInputStatusComponent,
      column: true,
      codeData: INPUT_DEMO_STATUS,
    },
    {
      name: 'borderless',
      component: ZardDemoInputBorderlessComponent,
      codeData: INPUT_DEMO_BORDERLESS,
    },
    {
      name: 'text-area',
      component: ZardDemoInputTextAreaComponent,
      column: true,
      codeData: INPUT_DEMO_TEXT_AREA,
    },
  ],
};
