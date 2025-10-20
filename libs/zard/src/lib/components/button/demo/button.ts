import { ZardDemoButtonDefaultComponent } from './default';
import { ZardDemoButtonFullComponent } from './full';
import { ZardDemoButtonLoadingComponent } from './loading';
import { ZardDemoButtonShapeComponent } from './shape';
import { ZardDemoButtonSizeComponent } from './size';
import { ZardDemoButtonTypeComponent } from './type';

export const BUTTON = {
  componentName: 'button',
  componentType: 'button',
  examples: [
    {
      name: 'default',
      component: ZardDemoButtonDefaultComponent,
    },
    {
      name: 'type',
      component: ZardDemoButtonTypeComponent,
    },
    {
      name: 'size',
      component: ZardDemoButtonSizeComponent,
    },
    {
      name: 'shape',
      component: ZardDemoButtonShapeComponent,
    },
    {
      name: 'full',
      component: ZardDemoButtonFullComponent,
    },
    {
      name: 'loading',
      component: ZardDemoButtonLoadingComponent,
    },
  ],
};
