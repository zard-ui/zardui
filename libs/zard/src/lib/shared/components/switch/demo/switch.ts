import { ZardDemoSwitchDefaultComponent } from './default';
import { ZardDemoSwitchDestructiveComponent } from './destructive';
import { ZardDemoSwitchDisabledComponent } from './disabled';
import { ZardDemoSwitchSizeComponent } from './size';

export const SWITCH = {
  componentName: 'switch',
  componentType: 'switch',
  description: 'A control that allows the user to toggle between checked and unchecked.',
  examples: [
    {
      name: 'default',
      component: ZardDemoSwitchDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoSwitchDestructiveComponent,
    },
    {
      name: 'size',
      component: ZardDemoSwitchSizeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoSwitchDisabledComponent,
    },
  ],
};
