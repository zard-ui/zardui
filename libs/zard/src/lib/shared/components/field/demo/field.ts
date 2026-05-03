import { FIELD_DEMO_CHECKBOX } from '@generated/components/field/demo/checkbox';
import { FIELD_DEMO_CHOICE_CARD } from '@generated/components/field/demo/choice-card';
import { FIELD_DEMO_DEFAULT } from '@generated/components/field/demo/default';
import { FIELD_DEMO_FIELD_GROUP } from '@generated/components/field/demo/field-group';
import { FIELD_DEMO_FIELDSET } from '@generated/components/field/demo/fieldset';
import { FIELD_DEMO_INPUT } from '@generated/components/field/demo/input';
import { FIELD_DEMO_RADIO } from '@generated/components/field/demo/radio';
import { FIELD_DEMO_SELECT } from '@generated/components/field/demo/select';
import { FIELD_DEMO_SLIDER } from '@generated/components/field/demo/slider';
import { FIELD_DEMO_SWITCH } from '@generated/components/field/demo/switch';
import { FIELD_DEMO_TEXTAREA } from '@generated/components/field/demo/textarea';
import { FIELD_CLI_ADD } from '@generated/installation/cli/add-field';
import { FIELD_MANUAL_CODE } from '@generated/installation/manual/field';
import { FIELD_USAGE_CODE, FIELD_USAGE_IMPORT } from '@generated/usage/field';

import { ZardDemoFieldCheckboxComponent } from './checkbox';
import { ZardDemoFieldChoiceCardComponent } from './choice-card';
import { ZardDemoFieldDefaultComponent } from './default';
import { ZardDemoFieldFieldGroupComponent } from './field-group';
import { ZardDemoFieldFieldsetComponent } from './fieldset';
import { ZardDemoFieldInputComponent } from './input';
import { ZardDemoFieldRadioComponent } from './radio';
import { ZardDemoFieldSelectComponent } from './select';
import { ZardDemoFieldSliderComponent } from './slider';
import { ZardDemoFieldSwitchComponent } from './switch';
import { ZardDemoFieldTextareaComponent } from './textarea';
import { FIELD_API } from '../doc/api';

export const FIELD = {
  api: FIELD_API,
  componentName: 'field',
  componentType: 'field',
  description: 'Composable building blocks for building accessible forms with labels, descriptions and errors.',
  installData: {
    cliAdd: FIELD_CLI_ADD,
    manualCode: FIELD_MANUAL_CODE,
  },
  usage: { importBlock: FIELD_USAGE_IMPORT, codeBlock: FIELD_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoFieldDefaultComponent,
    codeData: FIELD_DEMO_DEFAULT,
    column: false,
  },
  examples: [
    {
      name: 'input',
      component: ZardDemoFieldInputComponent,
      codeData: FIELD_DEMO_INPUT,
    },
    {
      name: 'textarea',
      component: ZardDemoFieldTextareaComponent,
      codeData: FIELD_DEMO_TEXTAREA,
    },
    {
      name: 'select',
      component: ZardDemoFieldSelectComponent,
      codeData: FIELD_DEMO_SELECT,
    },
    {
      name: 'slider',
      component: ZardDemoFieldSliderComponent,
      codeData: FIELD_DEMO_SLIDER,
    },
    {
      name: 'fieldset',
      component: ZardDemoFieldFieldsetComponent,
      codeData: FIELD_DEMO_FIELDSET,
    },
    {
      name: 'checkbox',
      component: ZardDemoFieldCheckboxComponent,
      codeData: FIELD_DEMO_CHECKBOX,
    },
    {
      name: 'radio',
      component: ZardDemoFieldRadioComponent,
      codeData: FIELD_DEMO_RADIO,
    },
    {
      name: 'switch',
      component: ZardDemoFieldSwitchComponent,
      codeData: FIELD_DEMO_SWITCH,
    },
    {
      name: 'choice-card',
      component: ZardDemoFieldChoiceCardComponent,
      codeData: FIELD_DEMO_CHOICE_CARD,
    },
    {
      name: 'field-group',
      component: ZardDemoFieldFieldGroupComponent,
      codeData: FIELD_DEMO_FIELD_GROUP,
    },
  ],
};
