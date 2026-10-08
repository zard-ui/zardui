import { SLIDER_DEMO_CONTROLLED } from '@generated/components/slider/demo/controlled';
import { SLIDER_DEMO_DISABLED } from '@generated/components/slider/demo/disabled';
import { SLIDER_DEMO_MULTIPLE } from '@generated/components/slider/demo/multiple';
import { SLIDER_DEMO_PREVIEW } from '@generated/components/slider/demo/preview';
import { SLIDER_DEMO_RANGE } from '@generated/components/slider/demo/range';
import { SLIDER_DEMO_VERTICAL } from '@generated/components/slider/demo/vertical';
import { SLIDER_CLI_ADD } from '@generated/installation/cli/add-slider';
import { SLIDER_MANUAL_CODE } from '@generated/installation/manual/slider';
import { SLIDER_USAGE_CODE, SLIDER_USAGE_IMPORT } from '@generated/usage/slider';

import { ZardDemoSliderControlledComponent } from '@/shared/components/slider/demo/controlled';
import { ZardDemoSliderMultipleComponent } from '@/shared/components/slider/demo/multiple';
import { ZardDemoSliderRangeComponent } from '@/shared/components/slider/demo/range';

import { ZardDemoSliderDisabledComponent } from './disabled';
import { ZardDemoSliderPreviewComponent } from './preview';
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
  preview: { name: 'preview', component: ZardDemoSliderPreviewComponent, codeData: SLIDER_DEMO_PREVIEW },
  examples: [
    {
      name: 'range',
      description:
        'Bind `[zDefault]` (or `[zValue]`) to a two-value array — `[lower, upper]` — for a range slider with two independently draggable thumbs.',
      component: ZardDemoSliderRangeComponent,
      codeData: SLIDER_DEMO_RANGE,
    },
    {
      name: 'multiple-thumbs',
      description:
        'Bind `[zDefault]` (or `[zValue]`) to an array with three or more values to render one thumb per entry.',
      component: ZardDemoSliderMultipleComponent,
      codeData: SLIDER_DEMO_MULTIPLE,
    },
    {
      name: 'vertical',
      description: 'Set `[zOrientation]="vertical"` for a vertical slider.',
      component: ZardDemoSliderVerticalComponent,
      codeData: SLIDER_DEMO_VERTICAL,
    },
    {
      name: 'controlled',
      description: 'Bind `[zValue]` and listen for `(zSlideIndexChange)` to drive the slider value from a signal.',
      component: ZardDemoSliderControlledComponent,
      codeData: SLIDER_DEMO_CONTROLLED,
    },
    {
      name: 'disabled',
      description: 'Use the `zDisabled` input to disable slider interaction.',
      component: ZardDemoSliderDisabledComponent,
      codeData: SLIDER_DEMO_DISABLED,
    },
  ],
};
