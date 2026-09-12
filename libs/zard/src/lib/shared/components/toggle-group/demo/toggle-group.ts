import { TOGGLE_GROUP_DEMO_CUSTOM } from '@generated/components/toggle-group/demo/custom';
import { TOGGLE_GROUP_DEMO_DISABLED } from '@generated/components/toggle-group/demo/disabled';
import { TOGGLE_GROUP_DEMO_OUTLINE } from '@generated/components/toggle-group/demo/outline';
import { TOGGLE_GROUP_DEMO_PREVIEW } from '@generated/components/toggle-group/demo/preview';
import { TOGGLE_GROUP_DEMO_SIZE } from '@generated/components/toggle-group/demo/size';
import { TOGGLE_GROUP_DEMO_SPACING } from '@generated/components/toggle-group/demo/spacing';
import { TOGGLE_GROUP_DEMO_VERTICAL } from '@generated/components/toggle-group/demo/vertical';
import { TOGGLE_GROUP_CLI_ADD } from '@generated/installation/cli/add-toggle-group';
import { TOGGLE_GROUP_MANUAL_CODE } from '@generated/installation/manual/toggle-group';
import { TOGGLE_GROUP_USAGE_CODE, TOGGLE_GROUP_USAGE_IMPORT } from '@generated/usage/toggle-group';

import { ZardDemoToggleGroupCustomComponent } from '@/shared/components/toggle-group/demo/custom';
import { ZardDemoToggleGroupVerticalComponent } from '@/shared/components/toggle-group/demo/vertical';

import { ZardDemoToggleGroupDisabledComponent } from './disabled';
import { ZardDemoToggleGroupOutlineComponent } from './outline';
import { ZardDemoToggleGroupPreviewComponent } from './preview';
import { ZardDemoToggleGroupSizeComponent } from './size';
import { ZardDemoToggleGroupSpacingComponent } from './spacing';
import { TOGGLE_GROUP_API } from '../doc/api';

export const TOGGLE_GROUP = {
  componentName: 'toggle-group',
  api: TOGGLE_GROUP_API,
  description:
    'A set of two-state buttons that can be pressed or released. Multiple buttons can be selected at the same time.',
  installData: {
    cliAdd: TOGGLE_GROUP_CLI_ADD,
    manualCode: TOGGLE_GROUP_MANUAL_CODE,
  },
  usage: { importBlock: TOGGLE_GROUP_USAGE_IMPORT, codeBlock: TOGGLE_GROUP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoToggleGroupPreviewComponent,
    codeData: TOGGLE_GROUP_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'outline',
      description: 'Use `zType="outline"` for an outline style.',
      component: ZardDemoToggleGroupOutlineComponent,
      codeData: TOGGLE_GROUP_DEMO_OUTLINE,
    },
    {
      name: 'size',
      description: 'Use the `zSize` to change the size of the toggle group.',
      component: ZardDemoToggleGroupSizeComponent,
      codeData: TOGGLE_GROUP_DEMO_SIZE,
    },
    {
      name: 'spacing',
      description:
        'Use `zSpacing` to control the gap between items, in spacing units. The default is `2`; set it to `0` to join the items into a single bar.',
      component: ZardDemoToggleGroupSpacingComponent,
      codeData: TOGGLE_GROUP_DEMO_SPACING,
    },
    {
      name: 'vertical',
      description: 'Use `zOrientation="vertical"` for vertical toggle groups.',
      component: ZardDemoToggleGroupVerticalComponent,
      codeData: TOGGLE_GROUP_DEMO_VERTICAL,
    },
    {
      name: 'disabled',
      description: 'Set `zDisabled` to disable every item in the group at once.',
      component: ZardDemoToggleGroupDisabledComponent,
      codeData: TOGGLE_GROUP_DEMO_DISABLED,
    },
    {
      name: 'custom',
      description: 'A custom toggle group example.',
      component: ZardDemoToggleGroupCustomComponent,
      codeData: TOGGLE_GROUP_DEMO_CUSTOM,
    },
  ],
};
