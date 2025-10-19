import { ZardDemoCommandDefaultComponent } from './default';
import { ZardDemoCommandJsonComponent } from './json';

export const COMMAND = {
  componentName: 'command',
  componentType: 'command',
  description: 'Fast, composable, unstyled command menu for Angular.',
  examples: [
    {
      name: 'default',
      component: ZardDemoCommandDefaultComponent,
    },
    {
      name: 'json',
      component: ZardDemoCommandJsonComponent,
    },
  ],
};
