import { RADIO_GROUP_DEMO_CHOICE_CARD } from '@generated/components/radio-group/demo/choice-card';
import { RADIO_GROUP_DEMO_DEFAULT } from '@generated/components/radio-group/demo/default';
import { RADIO_GROUP_DEMO_DESCRIPTION } from '@generated/components/radio-group/demo/description';
import { RADIO_GROUP_DEMO_DISABLED } from '@generated/components/radio-group/demo/disabled';
import { RADIO_GROUP_DEMO_FIELDSET } from '@generated/components/radio-group/demo/fieldset';
import { RADIO_GROUP_DEMO_INVALID } from '@generated/components/radio-group/demo/invalid';
import { RADIO_GROUP_CLI_ADD } from '@generated/installation/cli/add-radio-group';
import { RADIO_GROUP_MANUAL_CODE } from '@generated/installation/manual/radio-group';
import { RADIO_GROUP_USAGE_CODE, RADIO_GROUP_USAGE_IMPORT } from '@generated/usage/radio-group';

import { ZardDemoRadioGroupChoiceCardComponent } from './choice-card';
import { ZardDemoRadioGroupDefaultComponent } from './default';
import { ZardDemoRadioGroupDescriptionComponent } from './description';
import { ZardDemoRadioGroupDisabledComponent } from './disabled';
import { ZardDemoRadioGroupFieldsetComponent } from './fieldset';
import { ZardDemoRadioGroupInvalidComponent } from './invalid';
import { RADIO_GROUP_API } from '../doc/api';

export const RADIO_GROUP = {
  componentName: 'radio-group',
  componentType: 'radio-group',
  description:
    'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
  api: RADIO_GROUP_API,
  installData: {
    cliAdd: RADIO_GROUP_CLI_ADD,
    manualCode: RADIO_GROUP_MANUAL_CODE,
  },
  usage: { importBlock: RADIO_GROUP_USAGE_IMPORT, codeBlock: RADIO_GROUP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoRadioGroupDefaultComponent,
    column: false,
    codeData: RADIO_GROUP_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'description',
      description: 'Radio group items with a description using the `Field` component.',
      component: ZardDemoRadioGroupDescriptionComponent,
      codeData: RADIO_GROUP_DEMO_DESCRIPTION,
    },
    {
      name: 'choice-card',
      description: 'Use `FieldLabel` to wrap the entire `Field` for a clickable card-style selection.',
      component: ZardDemoRadioGroupChoiceCardComponent,
      codeData: RADIO_GROUP_DEMO_CHOICE_CARD,
    },
    {
      name: 'fieldset',
      description: 'Use `FieldSet` and `FieldLegend` to group radio items with a label and description.',
      component: ZardDemoRadioGroupFieldsetComponent,
      codeData: RADIO_GROUP_DEMO_FIELDSET,
    },
    {
      name: 'disabled',
      description: 'Use the `disabled` prop on `RadioGroupItem` to disable individual items.',
      component: ZardDemoRadioGroupDisabledComponent,
      codeData: RADIO_GROUP_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description: 'Use `aria-invalid` on `RadioGroupItem` and `data-invalid` on `Field` to show validation errors.',
      component: ZardDemoRadioGroupInvalidComponent,
      codeData: RADIO_GROUP_DEMO_INVALID,
    },
  ],
};
