import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionMultipleComponent } from './multiple';
import { ZardDemoAccordionMultipleLastNotCollapsibleComponent } from './multiple-last-not-collapsible';

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
