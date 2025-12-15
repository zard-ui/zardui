import { ZardDemoCheckboxDefaultComponent } from './default';
import { ZardDemoCheckboxDestructiveComponent } from './destructive';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxShapeComponent } from './shape';
import { ZardDemoCheckboxSizeComponent } from './size';

export const CHECKBOX = {
  componentName: 'checkbox',
  componentType: 'checkbox',
  description: 'A control that allows the user to toggle between checked and not checked.',
  examples: [
    {
      name: 'default',
      component: ZardDemoCheckboxDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoCheckboxDestructiveComponent,
    },
    {
      name: 'size',
      component: ZardDemoCheckboxSizeComponent,
    },
    {
      name: 'shape',
      component: ZardDemoCheckboxShapeComponent,
    },
    {
      name: 'disabled',
      component: ZardDemoCheckboxDisabledComponent,
    },
  ],
};
