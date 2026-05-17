import { TOGGLE_DEMO_DEFAULT } from '@generated/components/toggle/demo/default';
import { TOGGLE_DEMO_DISABLED } from '@generated/components/toggle/demo/disabled';
import { TOGGLE_DEMO_OUTLINE } from '@generated/components/toggle/demo/outline';
import { TOGGLE_DEMO_SIZE } from '@generated/components/toggle/demo/size';
import { TOGGLE_DEMO_WITH_BINDINGS } from '@generated/components/toggle/demo/with-bindings';
import { TOGGLE_DEMO_WITH_TEXT } from '@generated/components/toggle/demo/with-text';
import { TOGGLE_CLI_ADD } from '@generated/installation/cli/add-toggle';
import { TOGGLE_MANUAL_CODE } from '@generated/installation/manual/toggle';
import { TOGGLE_USAGE_CODE, TOGGLE_USAGE_IMPORT } from '@generated/usage/toggle';

import { ZardDemoToggleDefaultComponent } from './default';
import { ZardDemoToggleDisabledComponent } from './disabled';
import { ZardDemoToggleOutlineComponent } from './outline';
import { ZardDemoToggleSizeComponent } from './size';
import { ZardDemoToggleWithBindingsComponent } from './with-bindings';
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
    component: ZardDemoToggleDefaultComponent,
    codeData: TOGGLE_DEMO_DEFAULT,
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
      component: ZardDemoToggleDisabledComponent,
      codeData: TOGGLE_DEMO_DISABLED,
    },
    {
      name: 'with-',
      component: ZardDemoToggleWithBindingsComponent,
      codeData: TOGGLE_DEMO_WITH_BINDINGS,
    },
  ],
};
