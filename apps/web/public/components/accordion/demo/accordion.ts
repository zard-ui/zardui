import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionCollapsibleComponent } from './collapsible';
import { ZardDemoAccordionDefaultValueComponent } from './default-value';
import { ZardDemoAccordionMultipleComponent } from './multiple';

export const ACCORDION = {
  componentName: 'accordion',
  componentType: 'accordion',
  examples: [
    {
      name: 'basic',
      component: ZardDemoAccordionBasicComponent,
      column: true,
    },
    {
      name: 'collapsible',
      component: ZardDemoAccordionCollapsibleComponent,
      column: true,
    },
    {
      name: 'multiple',
      component: ZardDemoAccordionMultipleComponent,
      column: true,
    },
    {
      name: 'default-value',
      component: ZardDemoAccordionDefaultValueComponent,
      column: true,
    },
  ],
};
