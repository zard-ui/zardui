import { CHECKBOX_DEMO_DEFAULT } from '@generated/components/checkbox/demo/default';
import { CHECKBOX_DEMO_DESTRUCTIVE } from '@generated/components/checkbox/demo/destructive';
import { CHECKBOX_DEMO_DISABLED } from '@generated/components/checkbox/demo/disabled';
import { CHECKBOX_DEMO_SHAPE } from '@generated/components/checkbox/demo/shape';
import { CHECKBOX_DEMO_SIZE } from '@generated/components/checkbox/demo/size';
import { CHECKBOX_CLI_ADD } from '@generated/installation/cli/add-checkbox';
import { CHECKBOX_MANUAL_CODE } from '@generated/installation/manual/checkbox';

import { ZardDemoCheckboxDefaultComponent } from './default';
import { ZardDemoCheckboxDestructiveComponent } from './destructive';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxShapeComponent } from './shape';
import { ZardDemoCheckboxSizeComponent } from './size';
import { CHECKBOX_API } from '../doc/api';

export const CHECKBOX = {
  api: CHECKBOX_API,
  componentName: 'checkbox',
  componentType: 'checkbox',
  description: 'A control that allows the user to toggle between checked and not checked.',
  installData: {
    cliAdd: CHECKBOX_CLI_ADD,
    manualCode: CHECKBOX_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoCheckboxDefaultComponent,
      codeData: CHECKBOX_DEMO_DEFAULT,
    },
    {
      name: 'destructive',
      component: ZardDemoCheckboxDestructiveComponent,
      codeData: CHECKBOX_DEMO_DESTRUCTIVE,
    },
    {
      name: 'size',
      component: ZardDemoCheckboxSizeComponent,
      codeData: CHECKBOX_DEMO_SIZE,
    },
    {
      name: 'shape',
      component: ZardDemoCheckboxShapeComponent,
      codeData: CHECKBOX_DEMO_SHAPE,
    },
    {
      name: 'disabled',
      component: ZardDemoCheckboxDisabledComponent,
      codeData: CHECKBOX_DEMO_DISABLED,
    },
  ],
};
