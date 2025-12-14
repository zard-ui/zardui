import { ZardDemoKbdDefaultComponent } from './default';
import { ZardDemoKbdGroupComponent } from './group';
import { ZardDemoKbdTooltipComponent } from './tooltip';

export const KBD = {
  componentName: 'kbd',
  componentType: 'kbd',
  description: 'Display content as a keyboard key useful for documentation purposes.',
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
