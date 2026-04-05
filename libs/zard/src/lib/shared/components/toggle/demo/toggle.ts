import { TOGGLE_DEMO_DEFAULT } from '@generated/components/toggle/demo/default';
import { TOGGLE_DEMO_DISABLED } from '@generated/components/toggle/demo/disabled';
import { TOGGLE_DEMO_LARGE } from '@generated/components/toggle/demo/large';
import { TOGGLE_DEMO_OUTLINE } from '@generated/components/toggle/demo/outline';
import { TOGGLE_DEMO_SMALL } from '@generated/components/toggle/demo/small';
import { TOGGLE_DEMO_WITH_DEFAULT } from '@generated/components/toggle/demo/with-default';
import { TOGGLE_DEMO_WITH_FORMS } from '@generated/components/toggle/demo/with-forms';
import { TOGGLE_DEMO_WITH_TEXT } from '@generated/components/toggle/demo/with-text';
import { TOGGLE_CLI_ADD } from '@generated/installation/cli/add-toggle';
import { TOGGLE_MANUAL_CODE } from '@generated/installation/manual/toggle';
import { TOGGLE_USAGE_CODE, TOGGLE_USAGE_IMPORT } from '@generated/usage/toggle';

import { ZardDemoToggleDefaultComponent } from './default';
import { ZardDemoToggleDisabledComponent } from './disabled';
import { ZardDemoToggleLargeComponent } from './large';
import { ZardDemoToggleOutlineComponent } from './outline';
import { ZardDemoToggleSmallComponent } from './small';
import { ZardDemoToggleWithDefaultComponent } from './with-default';
import { ZardDemoToggleWithFormsComponent } from './with-forms';
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
  examples: [
    {
      name: 'default',
      component: ZardDemoToggleDefaultComponent,
      codeData: TOGGLE_DEMO_DEFAULT,
    },
    {
      name: 'with-forms',
      component: ZardDemoToggleWithFormsComponent,
      codeData: TOGGLE_DEMO_WITH_FORMS,
    },
    {
      name: 'with-default',
      component: ZardDemoToggleWithDefaultComponent,
      codeData: TOGGLE_DEMO_WITH_DEFAULT,
    },
    {
      name: 'outline',
      component: ZardDemoToggleOutlineComponent,
      codeData: TOGGLE_DEMO_OUTLINE,
    },
    {
      name: 'with-text',
      component: ZardDemoToggleWithTextComponent,
      codeData: TOGGLE_DEMO_WITH_TEXT,
    },
    {
      name: 'small',
      component: ZardDemoToggleSmallComponent,
      codeData: TOGGLE_DEMO_SMALL,
    },
    {
      name: 'large',
      component: ZardDemoToggleLargeComponent,
      codeData: TOGGLE_DEMO_LARGE,
    },
    {
      name: 'disabled',
      component: ZardDemoToggleDisabledComponent,
      codeData: TOGGLE_DEMO_DISABLED,
    },
  ],
};
