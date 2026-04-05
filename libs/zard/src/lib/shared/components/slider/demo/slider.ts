import { SLIDER_DEMO_DEFAULT } from '@generated/components/slider/demo/default';
import { SLIDER_DEMO_DISABLED } from '@generated/components/slider/demo/disabled';
import { SLIDER_DEMO_MIN_MAX } from '@generated/components/slider/demo/min-max';
import { SLIDER_DEMO_VERTICAL } from '@generated/components/slider/demo/vertical';
import { SLIDER_CLI_ADD } from '@generated/installation/cli/add-slider';
import { SLIDER_MANUAL_CODE } from '@generated/installation/manual/slider';
import { SLIDER_USAGE_CODE, SLIDER_USAGE_IMPORT } from '@generated/usage/slider';

import { ZardDemoSliderDefaultComponent } from './default';
import { ZardDemoSliderDisabledComponent } from './disabled';
import { ZardDemoSliderMinMaxComponent } from './min-max';
import { ZardDemoSliderVerticalComponent } from './vertical';
import { SLIDER_API } from '../doc/api';

export const SLIDER = {
  componentName: 'slider',
  componentType: 'slider',
  api: SLIDER_API,
  description: 'An input where the user selects a value from within a given range.',
  fullWidth: true,
  installData: {
    cliAdd: SLIDER_CLI_ADD,
    manualCode: SLIDER_MANUAL_CODE,
  },
  usage: { importBlock: SLIDER_USAGE_IMPORT, codeBlock: SLIDER_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoSliderDefaultComponent,
      codeData: SLIDER_DEMO_DEFAULT,
    },
    {
      name: 'disabled',
      component: ZardDemoSliderDisabledComponent,
      codeData: SLIDER_DEMO_DISABLED,
    },
    {
      name: 'min-max',
      component: ZardDemoSliderMinMaxComponent,
      codeData: SLIDER_DEMO_MIN_MAX,
    },
    {
      name: 'vertical',
      component: ZardDemoSliderVerticalComponent,
      codeData: SLIDER_DEMO_VERTICAL,
    },
  ],
};
