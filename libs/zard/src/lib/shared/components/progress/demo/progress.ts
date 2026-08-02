import { PROGRESS_DEMO_CONTROLLED } from '@generated/components/progress/demo/controlled';
import { PROGRESS_DEMO_LABEL } from '@generated/components/progress/demo/label';
import { PROGRESS_DEMO_PREVIEW } from '@generated/components/progress/demo/preview';
import { PROGRESS_CLI_ADD } from '@generated/installation/cli/add-progress';
import { PROGRESS_MANUAL_CODE } from '@generated/installation/manual/progress';
import { PROGRESS_USAGE_CODE, PROGRESS_USAGE_IMPORT } from '@generated/usage/progress';

import { ZardDemoProgressControlledComponent } from './controlled';
import { ZardDemoProgressLabelComponent } from './label';
import { ZardDemoProgressPreviewComponent } from './preview';
import { PROGRESS_API } from '../doc/api';

export const PROGRESS = {
  componentName: 'progress',
  componentType: 'progress',
  description: 'Displays an indicator showing the completion progress of a task.',
  api: PROGRESS_API,
  installData: {
    cliAdd: PROGRESS_CLI_ADD,
    manualCode: PROGRESS_MANUAL_CODE,
  },
  usage: { importBlock: PROGRESS_USAGE_IMPORT, codeBlock: PROGRESS_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoProgressPreviewComponent,
    codeData: PROGRESS_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'label',
      component: ZardDemoProgressLabelComponent,
      codeData: PROGRESS_DEMO_LABEL,
    },
    {
      name: 'controlled',
      component: ZardDemoProgressControlledComponent,
      codeData: PROGRESS_DEMO_CONTROLLED,
    },
  ],
};
