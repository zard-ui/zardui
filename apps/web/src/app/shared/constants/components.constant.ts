import { ZardDemoButtonBasicComponent } from '@zard/components/button/demo/basic';
import { ZardDemoButtonFullComponent } from '@zard/components/button/demo/full';
import { ZardDemoButtonLoadingComponent } from '@zard/components/button/demo/loading';
import { ZardDemoButtonShapeComponent } from '@zard/components/button/demo/shape';
import { ZardDemoButtonSizeComponent } from '@zard/components/button/demo/size';

export const COMPONENTS = [
  {
    componentName: 'button',
    examples: [
      {
        name: 'basic',
        component: ZardDemoButtonBasicComponent,
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
  },
];
