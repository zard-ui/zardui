import { ZardDemoSelectBasicComponent } from './default';
import { ZardDemoMultiSelectBasicComponent } from './multi-select';

export const SELECT = {
  componentName: 'select',
  componentType: 'select',
  description: 'Displays a list of options for the user to pick from—triggered by a button.',
  examples: [
    {
      name: 'default',
      component: ZardDemoSelectBasicComponent,
    },
    {
      name: 'multi-select',
      component: ZardDemoMultiSelectBasicComponent,
    },
  ],
};
