import { ZardDemoKbdDefaultComponent } from './default';
import { ZardDemoKbdGroupComponent } from './group';
import { ZardDemoKbdTooltipComponent } from './tooltip';

export const KBD = {
  componentName: 'kbd',
  componentType: 'kbd',
  description: 'Used to display textual user input from keyboard.',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoKbdDefaultComponent,
      column: true,
    },
    {
      name: 'group',
      component: ZardDemoKbdGroupComponent,
      column: true,
    },
    {
      name: 'tooltip',
      component: ZardDemoKbdTooltipComponent,
      column: true,
    },
  ],
};
