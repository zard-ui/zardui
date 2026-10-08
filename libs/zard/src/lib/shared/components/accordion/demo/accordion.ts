import { ACCORDION_DEMO_BASIC } from '@generated/components/accordion/demo/basic';
import { ACCORDION_DEMO_BORDERS } from '@generated/components/accordion/demo/borders';
import { ACCORDION_DEMO_CARD } from '@generated/components/accordion/demo/card';
import { ACCORDION_DEMO_DISABLED } from '@generated/components/accordion/demo/disabled';
import { ACCORDION_DEMO_MULTIPLE } from '@generated/components/accordion/demo/multiple';
import { ACCORDION_DEMO_PREVIEW } from '@generated/components/accordion/demo/preview';
import { ACCORDION_CLI_ADD } from '@generated/installation/cli/add-accordion';
import { ACCORDION_MANUAL_CODE } from '@generated/installation/manual/accordion';
import { ACCORDION_USAGE_IMPORT, ACCORDION_USAGE_CODE } from '@generated/usage/accordion';

import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionBordersComponent } from './borders';
import { ZardDemoAccordionCardComponent } from './card';
import { ZardDemoAccordionDisabledComponent } from './disabled';
import { ZardDemoAccordionMultipleComponent } from './multiple';
import { ZardDemoAccordionPreviewComponent } from './preview';
import { ACCORDION_API } from '../doc/api';

export const ACCORDION = {
  api: ACCORDION_API,
  componentName: 'accordion',
  componentType: 'accordion',
  description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
  installData: {
    cliAdd: ACCORDION_CLI_ADD,
    manualCode: ACCORDION_MANUAL_CODE,
  },
  usage: { importBlock: ACCORDION_USAGE_IMPORT, codeBlock: ACCORDION_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoAccordionPreviewComponent,
    column: false,
    codeData: ACCORDION_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'A basic accordion that shows one item at a time. The first item is open by default.',
      component: ZardDemoAccordionBasicComponent,
      column: false,
      codeData: ACCORDION_DEMO_BASIC,
    },
    {
      name: 'multiple',
      description: 'Use `zType="multiple"` to allow multiple items to be open at the same time.',
      component: ZardDemoAccordionMultipleComponent,
      column: true,
      codeData: ACCORDION_DEMO_MULTIPLE,
    },
    {
      name: 'disabled',
      description: 'Use the `zDisabled` input on `z-accordion-item` to disable individual items.',
      component: ZardDemoAccordionDisabledComponent,
      column: true,
      codeData: ACCORDION_DEMO_DISABLED,
    },
    {
      name: 'borders',
      description:
        'Add `rounded-lg border` to the `z-accordion` class and `px-4` to each `z-accordion-item` for a bordered, padded layout.',
      component: ZardDemoAccordionBordersComponent,
      column: true,
      codeData: ACCORDION_DEMO_BORDERS,
    },
    {
      name: 'card',
      description: 'Wrap the `z-accordion` in a `z-card` component.',
      component: ZardDemoAccordionCardComponent,
      column: true,
      codeData: ACCORDION_DEMO_CARD,
    },
  ],
};
