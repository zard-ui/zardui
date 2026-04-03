import { ACCORDION_DEMO_BASIC } from '@generated/components/accordion/demo/basic';
import { ACCORDION_DEMO_BORDERS } from '@generated/components/accordion/demo/borders';
import { ACCORDION_DEMO_CARDS } from '@generated/components/accordion/demo/cards';
import { ACCORDION_DEMO_DISABLED } from '@generated/components/accordion/demo/disabled';
import { ACCORDION_DEMO_MULTIPLE } from '@generated/components/accordion/demo/multiple';
import { ACCORDION_CLI_ADD } from '@generated/installation/cli/add-accordion';
import { ACCORDION_MANUAL_CODE } from '@generated/installation/manual/accordion';

import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionBordersComponent } from './borders';
import { ZardDemoAccordionCardComponent } from './cards';
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
  preview: {
    name: 'preview',
    component: ZardDemoAccordionPreviewComponent,
    column: false,
    codeData: ACCORDION_DEMO_BASIC,
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
      description: 'Use type="multiple" to allow multiple items to be open at the same time.',
      component: ZardDemoAccordionMultipleComponent,
      column: true,
      codeData: ACCORDION_DEMO_MULTIPLE,
    },
    {
      name: 'disabled',
      description: 'Use the disabled prop on AccordionItem to disable individual items.',
      component: ZardDemoAccordionDisabledComponent,
      column: true,
      codeData: ACCORDION_DEMO_DISABLED,
    },
    {
      name: 'borders',
      description:
        'Add border to the Accordion and border-b last:border-b-0 to the AccordionItem to add borders to the items.',
      component: ZardDemoAccordionBordersComponent,
      column: true,
      codeData: ACCORDION_DEMO_BORDERS,
    },
    {
      name: 'Card',
      description: 'Wrap the Accordion in a Card component.',
      component: ZardDemoAccordionCardComponent,
      column: true,
      codeData: ACCORDION_DEMO_CARDS,
    },
  ],
};
