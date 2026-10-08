import { TOGGLE_DEMO_CONTROLLED } from '@generated/components/toggle/demo/controlled';
import { TOGGLE_DEMO_DISABLED } from '@generated/components/toggle/demo/disabled';
import { TOGGLE_DEMO_OUTLINE } from '@generated/components/toggle/demo/outline';
import { TOGGLE_DEMO_PREVIEW } from '@generated/components/toggle/demo/preview';
import { TOGGLE_DEMO_SIZE } from '@generated/components/toggle/demo/size';
import { TOGGLE_DEMO_WITH_TEXT } from '@generated/components/toggle/demo/with-text';
import { TOGGLE_CLI_ADD } from '@generated/installation/cli/add-toggle';
import { TOGGLE_MANUAL_CODE } from '@generated/installation/manual/toggle';
import { TOGGLE_USAGE_CODE, TOGGLE_USAGE_IMPORT } from '@generated/usage/toggle';

import { ZardDemoToggleControlledComponent } from './controlled';
import { ZardDemoToggleDisabledComponent } from './disabled';
import { ZardDemoToggleOutlineComponent } from './outline';
import { ZardDemoTogglePreviewComponent } from './preview';
import { ZardDemoToggleSizeComponent } from './size';
import { ZardDemoToggleWithTextComponent } from './with-text';
import { TOGGLE_API } from '../doc/api';

export const TOGGLE = {
  componentName: 'toggle',
  componentType: 'toggle',
  api: TOGGLE_API,
  description: 'A two-state button that can be either on or off.',
  installData: {
    cliAdd: TOGGLE_CLI_ADD,
    manualCode: TOGGLE_MANUAL_CODE,
  },
  usage: { importBlock: TOGGLE_USAGE_IMPORT, codeBlock: TOGGLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTogglePreviewComponent,
    codeData: TOGGLE_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'outline',
      description: 'Use `zType="outline"` for an outline style.',
      component: ZardDemoToggleOutlineComponent,
      codeData: TOGGLE_DEMO_OUTLINE,
    },
    {
      name: 'with-text',
      description: 'Combine an icon with a text label inside the toggle.',
      component: ZardDemoToggleWithTextComponent,
      codeData: TOGGLE_DEMO_WITH_TEXT,
    },
    {
      name: 'size',
      description: 'Use the `zSize` input to change the size of the toggle.',
      component: ZardDemoToggleSizeComponent,
      codeData: TOGGLE_DEMO_SIZE,
    },
    {
      name: 'disabled',
      description: 'Set `zDisabled` to prevent interaction, on either `default` or `outline` types.',
      component: ZardDemoToggleDisabledComponent,
      codeData: TOGGLE_DEMO_DISABLED,
    },
    {
      name: 'controlled',
      description: 'Bind `[(zValue)]` two-way to drive the toggle from, and read it back into, external state.',
      component: ZardDemoToggleControlledComponent,
      codeData: TOGGLE_DEMO_CONTROLLED,
    },
  ],
};
