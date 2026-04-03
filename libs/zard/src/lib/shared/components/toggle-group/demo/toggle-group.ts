import { TOGGLE_GROUP_DEMO_DEFAULT } from '@generated/components/toggle-group/demo/default';
import { TOGGLE_GROUP_DEMO_OUTLINE } from '@generated/components/toggle-group/demo/outline';
import { TOGGLE_GROUP_DEMO_SINGLE } from '@generated/components/toggle-group/demo/single';
import { TOGGLE_GROUP_DEMO_SIZES } from '@generated/components/toggle-group/demo/sizes';
import { TOGGLE_GROUP_DEMO_WITH_TEXT } from '@generated/components/toggle-group/demo/with-text';
import { TOGGLE_GROUP_CLI_ADD } from '@generated/installation/cli/add-toggle-group';
import { TOGGLE_GROUP_MANUAL_CODE } from '@generated/installation/manual/toggle-group';

import ToggleGroupDefaultComponent from './default';
import ToggleGroupOutlineComponent from './outline';
import ToggleGroupSingleComponent from './single';
import ToggleGroupSizesComponent from './sizes';
import ToggleGroupWithTextComponent from './with-text';
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
  examples: [
    {
      name: 'default',
      component: ToggleGroupDefaultComponent,
      codeData: TOGGLE_GROUP_DEMO_DEFAULT,
    },
    {
      name: 'with-text',
      component: ToggleGroupWithTextComponent,
      codeData: TOGGLE_GROUP_DEMO_WITH_TEXT,
    },
    {
      name: 'outline',
      component: ToggleGroupOutlineComponent,
      codeData: TOGGLE_GROUP_DEMO_OUTLINE,
    },
    {
      name: 'single',
      component: ToggleGroupSingleComponent,
      codeData: TOGGLE_GROUP_DEMO_SINGLE,
    },
    {
      name: 'sizes',
      component: ToggleGroupSizesComponent,
      codeData: TOGGLE_GROUP_DEMO_SIZES,
    },
  ],
};
