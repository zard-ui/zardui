import { PROGRESS_BAR_DEMO_BASIC } from '@generated/components/progress-bar/demo/basic';
import { PROGRESS_BAR_DEMO_INDETERMINATE } from '@generated/components/progress-bar/demo/indeterminate';
import { PROGRESS_BAR_DEMO_SHAPE } from '@generated/components/progress-bar/demo/shape';
import { PROGRESS_BAR_DEMO_SIZE } from '@generated/components/progress-bar/demo/size';
import { PROGRESS_BAR_CLI_ADD } from '@generated/installation/cli/add-progress-bar';
import { PROGRESS_BAR_MANUAL_CODE } from '@generated/installation/manual/progress-bar';
import { PROGRESS_BAR_USAGE_IMPORT, PROGRESS_BAR_USAGE_CODE } from '@generated/usage/progress-bar';

import { ZardDemoProgressBarBasicComponent } from './basic';
import { ZardDemoProgressBarIndeterminateComponent } from './indeterminate';
import { ZardDemoProgressBarShapeComponent } from './shape';
import { ZardDemoProgressBarSizeComponent } from './size';
import { PROGRESS_BAR_API } from '../doc/api';

export const PROGRESS_BAR = {
  componentName: 'progress-bar',
  componentType: 'progress-bar',
  description:
    'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  api: PROGRESS_BAR_API,
  fullWidth: true,
  installData: {
    cliAdd: PROGRESS_BAR_CLI_ADD,
    manualCode: PROGRESS_BAR_MANUAL_CODE,
  },
  usage: { importBlock: PROGRESS_BAR_USAGE_IMPORT, codeBlock: PROGRESS_BAR_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: ZardDemoProgressBarBasicComponent,
      codeData: PROGRESS_BAR_DEMO_BASIC,
    },
    {
      name: 'indeterminate',
      component: ZardDemoProgressBarIndeterminateComponent,
      codeData: PROGRESS_BAR_DEMO_INDETERMINATE,
    },
    {
      name: 'shape',
      component: ZardDemoProgressBarShapeComponent,
      codeData: PROGRESS_BAR_DEMO_SHAPE,
    },
    {
      name: 'size',
      component: ZardDemoProgressBarSizeComponent,
      codeData: PROGRESS_BAR_DEMO_SIZE,
    },
  ],
};
