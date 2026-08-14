import { COMBOBOX_DEMO_AUTO_HIGHLIGHT } from '@generated/components/combobox/demo/auto-highlight';
import { COMBOBOX_DEMO_CLEAR } from '@generated/components/combobox/demo/clear';
import { COMBOBOX_DEMO_CUSTOM_ITEMS } from '@generated/components/combobox/demo/custom-items';
import { COMBOBOX_DEMO_DEFAULT } from '@generated/components/combobox/demo/default';
import { COMBOBOX_DEMO_DISABLED } from '@generated/components/combobox/demo/disabled';
import { COMBOBOX_DEMO_GROUPED } from '@generated/components/combobox/demo/grouped';
import { COMBOBOX_DEMO_INPUT_GROUP } from '@generated/components/combobox/demo/input-group';
import { COMBOBOX_DEMO_INVALID } from '@generated/components/combobox/demo/invalid';
import { COMBOBOX_DEMO_MULTIPLE } from '@generated/components/combobox/demo/multiple';
import { COMBOBOX_DEMO_POPUP } from '@generated/components/combobox/demo/popup';
import { COMBOBOX_DEMO_SHORTHAND } from '@generated/components/combobox/demo/shorthand';
import { COMBOBOX_CLI_ADD } from '@generated/installation/cli/add-combobox';
import { COMBOBOX_MANUAL_CODE } from '@generated/installation/manual/combobox';
import { COMBOBOX_USAGE_IMPORT, COMBOBOX_USAGE_CODE } from '@generated/usage/combobox';

import { ZardDemoComboboxAutoHighlightComponent } from './auto-highlight';
import { ZardDemoComboboxClearComponent } from './clear';
import { ZardDemoComboboxCustomItemsComponent } from './custom-items';
import { ZardDemoComboboxDefaultComponent } from './default';
import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxGroupedComponent } from './grouped';
import { ZardDemoComboboxInputGroupComponent } from './input-group';
import { ZardDemoComboboxInvalidComponent } from './invalid';
import { ZardDemoComboboxMultipleComponent } from './multiple';
import { ZardDemoComboboxPopupComponent } from './popup';
import { ZardDemoComboboxShorthandComponent } from './shorthand';
import { COMBOBOX_API } from '../doc/api';

export const COMBOBOX = {
  api: COMBOBOX_API,
  componentName: 'combobox',
  componentType: 'combobox',
  description: 'Autocomplete input and command palette with a list of suggestions.',
  installData: {
    cliAdd: COMBOBOX_CLI_ADD,
    manualCode: COMBOBOX_MANUAL_CODE,
  },
  usage: { importBlock: COMBOBOX_USAGE_IMPORT, codeBlock: COMBOBOX_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoComboboxDefaultComponent,
      codeData: COMBOBOX_DEMO_DEFAULT,
    },
    {
      name: 'multiple',
      component: ZardDemoComboboxMultipleComponent,
      codeData: COMBOBOX_DEMO_MULTIPLE,
    },
    {
      name: 'clear',
      component: ZardDemoComboboxClearComponent,
      codeData: COMBOBOX_DEMO_CLEAR,
    },
    {
      name: 'grouped',
      component: ZardDemoComboboxGroupedComponent,
      codeData: COMBOBOX_DEMO_GROUPED,
    },
    {
      name: 'custom-items',
      component: ZardDemoComboboxCustomItemsComponent,
      codeData: COMBOBOX_DEMO_CUSTOM_ITEMS,
    },
    {
      name: 'invalid',
      component: ZardDemoComboboxInvalidComponent,
      codeData: COMBOBOX_DEMO_INVALID,
    },
    {
      name: 'disabled',
      component: ZardDemoComboboxDisabledComponent,
      codeData: COMBOBOX_DEMO_DISABLED,
    },
    {
      name: 'auto-highlight',
      component: ZardDemoComboboxAutoHighlightComponent,
      codeData: COMBOBOX_DEMO_AUTO_HIGHLIGHT,
    },
    {
      name: 'popup',
      component: ZardDemoComboboxPopupComponent,
      codeData: COMBOBOX_DEMO_POPUP,
    },
    {
      name: 'input-group',
      component: ZardDemoComboboxInputGroupComponent,
      codeData: COMBOBOX_DEMO_INPUT_GROUP,
    },
    {
      name: 'shorthand',
      component: ZardDemoComboboxShorthandComponent,
      codeData: COMBOBOX_DEMO_SHORTHAND,
    },
  ],
};
