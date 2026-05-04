import { SPINNER_DEMO_BADGE } from '@generated/components/spinner/demo/badge';
import { SPINNER_DEMO_BUTTON } from '@generated/components/spinner/demo/button';
import { SPINNER_DEMO_CUSTOMIZATION } from '@generated/components/spinner/demo/customization';
import { SPINNER_DEMO_EMPTY } from '@generated/components/spinner/demo/empty';
import { SPINNER_DEMO_INPUT_GROUP } from '@generated/components/spinner/demo/input-group';
import { SPINNER_DEMO_SIZE } from '@generated/components/spinner/demo/size';
import { SPINNER_CLI_ADD } from '@generated/installation/cli/add-spinner';
import { SPINNER_MANUAL_CODE } from '@generated/installation/manual/spinner';
import { SPINNER_USAGE_CODE, SPINNER_USAGE_IMPORT } from '@generated/usage/spinner';

import { ZardDemoSpinnerBadgeComponent } from './badge';
import { ZardDemoSpinnerButtonComponent } from './button';
import { ZardDemoSpinnerCustomizationComponent } from './customization';
import { ZardDemoSpinnerEmptyComponent } from './empty';
import { ZardDemoSpinnerInputGroupComponent } from './input-group';
import { ZardDemoSpinnerSizeComponent } from './size';
import { SPINNER_API } from '../doc/api';

export const SPINNER = {
  componentName: 'spinner',
  componentType: 'spinner',
  description:
    'A visual component that displays a loading animation to indicate that an action or process is in progress.',
  api: SPINNER_API,
  installData: {
    cliAdd: SPINNER_CLI_ADD,
    manualCode: SPINNER_MANUAL_CODE,
  },
  usage: { importBlock: SPINNER_USAGE_IMPORT, codeBlock: SPINNER_USAGE_CODE },
  examples: [
    {
      name: 'customization',
      component: ZardDemoSpinnerCustomizationComponent,
      codeData: SPINNER_DEMO_CUSTOMIZATION,
    },
    {
      name: 'size',
      component: ZardDemoSpinnerSizeComponent,
      codeData: SPINNER_DEMO_SIZE,
    },
    {
      name: 'button',
      component: ZardDemoSpinnerButtonComponent,
      codeData: SPINNER_DEMO_BUTTON,
    },
    {
      name: 'badge',
      component: ZardDemoSpinnerBadgeComponent,
      codeData: SPINNER_DEMO_BADGE,
    },
    {
      name: 'input-group',
      component: ZardDemoSpinnerInputGroupComponent,
      codeData: SPINNER_DEMO_INPUT_GROUP,
    },
    {
      name: 'empty',
      component: ZardDemoSpinnerEmptyComponent,
      codeData: SPINNER_DEMO_EMPTY,
    },
  ],
};
