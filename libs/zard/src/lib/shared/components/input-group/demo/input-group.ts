import { INPUT_GROUP_DEMO_BORDERLESS } from '@generated/components/input-group/demo/borderless';
import { INPUT_GROUP_DEMO_DEFAULT } from '@generated/components/input-group/demo/default';
import { INPUT_GROUP_DEMO_LOADING } from '@generated/components/input-group/demo/loading';
import { INPUT_GROUP_DEMO_SIZE } from '@generated/components/input-group/demo/size';
import { INPUT_GROUP_DEMO_TEXT } from '@generated/components/input-group/demo/text';
import { INPUT_GROUP_CLI_ADD } from '@generated/installation/cli/add-input-group';
import { INPUT_GROUP_MANUAL_CODE } from '@generated/installation/manual/input-group';

import { ZardDemoInputGroupBorderlessComponent } from './borderless';
import { ZardDemoInputGroupDefaultComponent } from './default';
import { ZardDemoInputGroupLoadingComponent } from './loading';
import { ZardDemoInputGroupSizeComponent } from './size';
import { ZardDemoInputGroupTextComponent } from './text';
import { INPUT_GROUP_API } from '../doc/api';

export const INPUT_GROUP = {
  componentName: 'input-group',
  componentType: 'input-group',
  description: 'Display additional information or actions to an input or textarea.',
  api: INPUT_GROUP_API,
  installData: {
    cliAdd: INPUT_GROUP_CLI_ADD,
    manualCode: INPUT_GROUP_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoInputGroupDefaultComponent,
      column: true,
      codeData: INPUT_GROUP_DEMO_DEFAULT,
    },
    {
      name: 'text',
      component: ZardDemoInputGroupTextComponent,
      column: true,
      codeData: INPUT_GROUP_DEMO_TEXT,
    },

    {
      name: 'size',
      component: ZardDemoInputGroupSizeComponent,
      column: true,
      codeData: INPUT_GROUP_DEMO_SIZE,
    },
    {
      name: 'borderless',
      component: ZardDemoInputGroupBorderlessComponent,
      column: true,
      codeData: INPUT_GROUP_DEMO_BORDERLESS,
    },
    {
      name: 'loading',
      component: ZardDemoInputGroupLoadingComponent,
      column: true,
      codeData: INPUT_GROUP_DEMO_LOADING,
    },
  ],
};
