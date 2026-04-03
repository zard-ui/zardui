import { RADIO_DEMO_DEFAULT } from '@generated/components/radio/demo/default';
import { RADIO_DEMO_DISABLED } from '@generated/components/radio/demo/disabled';
import { RADIO_CLI_ADD } from '@generated/installation/cli/add-radio';
import { RADIO_MANUAL_CODE } from '@generated/installation/manual/radio';

import { ZardDemoRadioDefaultComponent } from './default';
import { ZardDemoRadioDisabledComponent } from './disabled';
import { RADIO_API } from '../doc/api';

export const RADIO = {
  componentName: 'radio',
  componentType: 'radio',
  description: 'A control that allows the user to select one option from a set of options.',
  api: RADIO_API,
  installData: {
    cliAdd: RADIO_CLI_ADD,
    manualCode: RADIO_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoRadioDefaultComponent,
      codeData: RADIO_DEMO_DEFAULT,
    },
    {
      name: 'disabled',
      component: ZardDemoRadioDisabledComponent,
      codeData: RADIO_DEMO_DISABLED,
    },
  ],
};
