import { SLIDER_DEMO_CONTROLLED } from '@generated/components/slider/demo/controlled';
import { SLIDER_DEMO_DEFAULT } from '@generated/components/slider/demo/default';
import { SLIDER_DEMO_DISABLED } from '@generated/components/slider/demo/disabled';
import { SLIDER_DEMO_MULTIPLE } from '@generated/components/slider/demo/multiple';
import { SLIDER_DEMO_RANGE } from '@generated/components/slider/demo/range';
import { SLIDER_DEMO_VERTICAL } from '@generated/components/slider/demo/vertical';
import { SLIDER_CLI_ADD } from '@generated/installation/cli/add-slider';
import { SLIDER_MANUAL_CODE } from '@generated/installation/manual/slider';
import { SLIDER_USAGE_CODE, SLIDER_USAGE_IMPORT } from '@generated/usage/slider';

import { ZardDemoSliderControlledComponent } from '@/shared/components/slider/demo/controlled';
import { ZardDemoSliderMultipleComponent } from '@/shared/components/slider/demo/multiple';
import { ZardDemoSliderRangeComponent } from '@/shared/components/slider/demo/range';

import { ZardDemoSliderDefaultComponent } from './default';
import { ZardDemoSliderDisabledComponent } from './disabled';
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
  preview: { name: 'default', component: ZardDemoSliderDefaultComponent, codeData: SLIDER_DEMO_DEFAULT },
  examples: [
    {
      name: 'range',
      description: 'Use an array with two values for a range slider.',
      component: ZardDemoSliderRangeComponent,
      codeData: SLIDER_DEMO_RANGE,
    },
    {
      name: 'multiple-thumbs',
      description: 'Use an array with multiple values for multiple thumbs.',
      component: ZardDemoSliderMultipleComponent,
      codeData: SLIDER_DEMO_MULTIPLE,
    },
    {
      name: 'vertical',
      description: 'Use zOrientation="vertical" for a vertical slider.',
      component: ZardDemoSliderVerticalComponent,
      codeData: SLIDER_DEMO_VERTICAL,
    },
    {
      name: 'controlled',
      component: ZardDemoSliderControlledComponent,
      codeData: SLIDER_DEMO_CONTROLLED,
    },
    {
      name: 'disabled',
      description: 'Use zDisabled prop to disable the slider.',
      component: ZardDemoSliderDisabledComponent,
      codeData: SLIDER_DEMO_DISABLED,
    },
  ],
};
