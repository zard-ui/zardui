import { ZardDemoAccordionMultipleComponent } from '@/shared/components/accordion/demo/multiple';
import { ZardDemoAccordionMultipleLastNotCollapsibleComponent } from '@/shared/components/accordion/demo/multiple-last-not-collapsible';

import { ZardDemoAccordionBasicComponent } from './basic';

export const ACCORDION = {
  componentName: 'accordion',
  componentType: 'accordion',
  description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAccordionBasicComponent,
      column: false,
    },
    {
      name: 'multiple',
      component: ZardDemoAccordionMultipleComponent,
      column: true,
    },
    {
      name: 'multiple-last-not-collapsible',
      component: ZardDemoAccordionMultipleLastNotCollapsibleComponent,
      column: true,
    },
  ],
};
