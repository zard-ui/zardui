```angular-ts showLineNumbers
import { ZardDemoAccordionBasicComponent } from './basic';
import { ZardDemoAccordionMultipleComponent } from './multiple';

export const ACCORDION = {
  componentName: 'accordion',
  componentType: 'accordion',
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
  ],
};

```