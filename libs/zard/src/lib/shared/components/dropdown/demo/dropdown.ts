import { ZardDropdownHoverDemoComponent } from '@/shared/components/dropdown/demo/hover';

import { ZardDropdownDemoComponent } from './default';

export const DROPDOWN = {
  componentName: 'dropdown',
  componentType: 'dropdown',
  description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
  examples: [
    {
      name: 'default',
      component: ZardDropdownDemoComponent,
    },
    {
      name: 'hover',
      component: ZardDropdownHoverDemoComponent,
    },
  ],
};
