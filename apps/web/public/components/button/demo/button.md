```angular-ts showLineNumbers
import { ZardDemoButtonDestructiveComponent } from './destructive';
import { ZardDemoButtonSecondaryComponent } from './secondary';
import { ZardDemoButtonOutlineComponent } from './outline';
import { ZardDemoButtonLoadingComponent } from './loading';
import { ZardDemoButtonDefaultComponent } from './default';
import { ZardDemoButtonShapeComponent } from './shape';
import { ZardDemoButtonGhostComponent } from './ghost';
import { ZardDemoButtonSizeComponent } from './size';
import { ZardDemoButtonFullComponent } from './full';

export const BUTTON = {
  componentName: 'button',
  componentType: 'button',
  examples: [
    {
      name: 'default',
      component: ZardDemoButtonDefaultComponent,
    },
    {
      name: 'secondary',
      component: ZardDemoButtonSecondaryComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoButtonDestructiveComponent,
    },
    {
      name: 'outline',
      component: ZardDemoButtonOutlineComponent,
    },
    {
      name: 'ghost',
      component: ZardDemoButtonGhostComponent,
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
      name: 'loading',
      component: ZardDemoButtonLoadingComponent,
    },
    {
      name: 'full',
      component: ZardDemoButtonFullComponent,
    },
  ],
};

```