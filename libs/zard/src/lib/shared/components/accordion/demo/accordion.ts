import { ACCORDION_DEMO_BASIC } from '@generated/components/accordion/demo/basic';
import { ACCORDION_DEMO_MULTIPLE } from '@generated/components/accordion/demo/multiple';
import { ACCORDION_DEMO_MULTIPLE_LAST_NOT_COLLAPSIBLE } from '@generated/components/accordion/demo/multiple-last-not-collapsible';
import { ACCORDION_CLI_ADD } from '@generated/installation/cli/add-accordion';
import { ACCORDION_MANUAL_CODE } from '@generated/installation/manual/accordion';

import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionMultipleComponent } from './multiple';
import { ZardDemoAccordionMultipleLastNotCollapsibleComponent } from './multiple-last-not-collapsible';

export const ACCORDION = {
  componentName: 'accordion',
  componentType: 'accordion',
  description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
  installData: {
    cliAdd: ACCORDION_CLI_ADD,
    manualCode: ACCORDION_MANUAL_CODE,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoAccordionBasicComponent,
      column: false,
      codeData: ACCORDION_DEMO_BASIC,
    },
    {
      name: 'multiple',
      component: ZardDemoAccordionMultipleComponent,
      column: true,
      codeData: ACCORDION_DEMO_MULTIPLE,
    },
    {
      name: 'multiple-last-not-collapsible',
      component: ZardDemoAccordionMultipleLastNotCollapsibleComponent,
      column: true,
      codeData: ACCORDION_DEMO_MULTIPLE_LAST_NOT_COLLAPSIBLE,
    },
  ],
};
