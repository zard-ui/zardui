import { TEXTAREA_DEMO_BORDERLESS } from '@generated/components/textarea/demo/borderless';
import { TEXTAREA_DEMO_DEFAULT } from '@generated/components/textarea/demo/default';
import { TEXTAREA_CLI_ADD } from '@generated/installation/cli/add-textarea';
import { TEXTAREA_MANUAL_CODE } from '@generated/installation/manual/textarea';
import { TEXTAREA_USAGE_CODE, TEXTAREA_USAGE_IMPORT } from '@generated/usage/textarea';

import { ZardDemoTextareaBorderlessComponent } from './borderless';
import { ZardDemoTextareaDefaultComponent } from './default';
import { TEXTAREA_API } from '../doc/api';

export const TEXTAREA = {
  componentName: 'textarea',
  componentType: 'textarea',
  description: 'Displays a multi-line text input field.',
  api: TEXTAREA_API,
  installData: {
    cliAdd: TEXTAREA_CLI_ADD,
    manualCode: TEXTAREA_MANUAL_CODE,
  },
  usage: { importBlock: TEXTAREA_USAGE_IMPORT, codeBlock: TEXTAREA_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTextareaDefaultComponent,
    column: false,
    codeData: TEXTAREA_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'borderless',
      description: 'Use the zBorderless prop to render a textarea without border or focus ring.',
      component: ZardDemoTextareaBorderlessComponent,
      codeData: TEXTAREA_DEMO_BORDERLESS,
    },
  ],
};
