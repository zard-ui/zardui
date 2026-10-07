import { RADIO_GROUP_DEMO_CHOICE_CARD } from '@generated/components/radio-group/demo/choice-card';
import { RADIO_GROUP_DEMO_DESCRIPTION } from '@generated/components/radio-group/demo/description';
import { RADIO_GROUP_DEMO_DISABLED } from '@generated/components/radio-group/demo/disabled';
import { RADIO_GROUP_DEMO_FIELDSET } from '@generated/components/radio-group/demo/fieldset';
import { RADIO_GROUP_DEMO_INVALID } from '@generated/components/radio-group/demo/invalid';
import { RADIO_GROUP_DEMO_PREVIEW } from '@generated/components/radio-group/demo/preview';
import { RADIO_GROUP_DEMO_REACTIVE_FORMS } from '@generated/components/radio-group/demo/reactive-forms';
import { RADIO_GROUP_CLI_ADD } from '@generated/installation/cli/add-radio-group';
import { RADIO_GROUP_MANUAL_CODE } from '@generated/installation/manual/radio-group';
import { RADIO_GROUP_USAGE_CODE, RADIO_GROUP_USAGE_IMPORT } from '@generated/usage/radio-group';

import { ZardDemoRadioGroupChoiceCardComponent } from './choice-card';
import { ZardDemoRadioGroupDescriptionComponent } from './description';
import { ZardDemoRadioGroupDisabledComponent } from './disabled';
import { ZardDemoRadioGroupFieldsetComponent } from './fieldset';
import { ZardDemoRadioGroupInvalidComponent } from './invalid';
import { ZardDemoRadioGroupPreviewComponent } from './preview';
import { ZardDemoRadioGroupReactiveFormsComponent } from './reactive-forms';
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
    component: ZardDemoRadioGroupPreviewComponent,
    column: false,
    codeData: RADIO_GROUP_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'description',
      description:
        'Radio group items with a description, composed from `z-field`, `z-field-content` and `z-field-description`.',
      component: ZardDemoRadioGroupDescriptionComponent,
      codeData: RADIO_GROUP_DEMO_DESCRIPTION,
    },
    {
      name: 'choice-card',
      description: 'Wrap the whole `z-field` in a `label[z-field-label]` for a clickable card-style selection.',
      component: ZardDemoRadioGroupChoiceCardComponent,
      codeData: RADIO_GROUP_DEMO_CHOICE_CARD,
    },
    {
      name: 'fieldset',
      description:
        'Use `fieldset[z-field-set]` and `legend[z-field-legend]` to group radio items with a label and description.',
      component: ZardDemoRadioGroupFieldsetComponent,
      codeData: RADIO_GROUP_DEMO_FIELDSET,
    },
    {
      name: 'disabled',
      description:
        'Set `zDisabled` on a single `z-radio` to disable that item; `data-disabled` on `z-field` drives the disabled styles.',
      component: ZardDemoRadioGroupDisabledComponent,
      codeData: RADIO_GROUP_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        'Set `zInvalid` on `z-radio` (which sets `aria-invalid`) and `data-invalid` on `z-field` to show validation errors.',
      component: ZardDemoRadioGroupInvalidComponent,
      codeData: RADIO_GROUP_DEMO_INVALID,
    },
    {
      name: 'reactive-forms',
      description:
        'Bind `z-radio-group` with `formControlName`; the disabled state of a `FormControl` is respected out of the box.',
      component: ZardDemoRadioGroupReactiveFormsComponent,
      codeData: RADIO_GROUP_DEMO_REACTIVE_FORMS,
    },
  ],
};
