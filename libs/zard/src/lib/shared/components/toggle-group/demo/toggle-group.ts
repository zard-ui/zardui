import { TOGGLE_GROUP_DEMO_CUSTOM } from '@generated/components/toggle-group/demo/custom';
import { TOGGLE_GROUP_DEMO_DEFAULT } from '@generated/components/toggle-group/demo/default';
import { TOGGLE_GROUP_DEMO_DISABLED } from '@generated/components/toggle-group/demo/disabled';
import { TOGGLE_GROUP_DEMO_OUTLINE } from '@generated/components/toggle-group/demo/outline';
import { TOGGLE_GROUP_DEMO_SIZES } from '@generated/components/toggle-group/demo/sizes';
import { TOGGLE_GROUP_DEMO_SPACING } from '@generated/components/toggle-group/demo/spacing';
import { TOGGLE_GROUP_DEMO_VERTICAL } from '@generated/components/toggle-group/demo/vertical';
import { TOGGLE_GROUP_CLI_ADD } from '@generated/installation/cli/add-toggle-group';
import { TOGGLE_GROUP_MANUAL_CODE } from '@generated/installation/manual/toggle-group';
import { TOGGLE_GROUP_USAGE_CODE, TOGGLE_GROUP_USAGE_IMPORT } from '@generated/usage/toggle-group';

import ToggleGroupCustomComponent from '@/shared/components/toggle-group/demo/custom';
import ToggleGroupVerticalComponent from '@/shared/components/toggle-group/demo/vertical';

import ToggleGroupDefaultComponent from './default';
import ToggleGroupDisabledComponent from './disabled';
import ToggleGroupOutlineComponent from './outline';
import ToggleGroupSizesComponent from './sizes';
import ToggleGroupSpacingComponent from './spacing';
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
    component: ToggleGroupDefaultComponent,
    codeData: TOGGLE_GROUP_DEMO_DEFAULT,
    column: false,
  },
  examples: [
    {
      name: 'outline',
      description: 'Use `zType="outline"` for an outline style.',
      component: ToggleGroupOutlineComponent,
      codeData: TOGGLE_GROUP_DEMO_OUTLINE,
    },
    {
      name: 'size',
      description: 'Use the `zSize` to change the size of the toggle group.',
      component: ToggleGroupSizesComponent,
      codeData: TOGGLE_GROUP_DEMO_SIZES,
    },
    {
      name: 'spacing',
      description: 'Use `zSpacing` to add spacing between toggle group items.',
      component: ToggleGroupSpacingComponent,
      codeData: TOGGLE_GROUP_DEMO_SPACING,
    },
    {
      name: 'vertical',
      description: 'Use `zOrientation="vertical"` for vertical toggle groups.',
      component: ToggleGroupVerticalComponent,
      codeData: TOGGLE_GROUP_DEMO_VERTICAL,
    },
    {
      name: 'disabled',
      component: ToggleGroupDisabledComponent,
      codeData: TOGGLE_GROUP_DEMO_DISABLED,
    },
    {
      name: 'custom',
      description: 'A custom toggle group example.',
      component: ToggleGroupCustomComponent,
      codeData: TOGGLE_GROUP_DEMO_CUSTOM,
    },
  ],
};
