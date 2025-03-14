import { ComponentType } from '@angular/cdk/overlay';
import { ZardDemoButtonBasicComponent } from '@zard/components/button/demo/basic';
import { ZardDemoButtonFullComponent } from '@zard/components/button/demo/full';
import { ZardDemoButtonLoadingComponent } from '@zard/components/button/demo/loading';
import { ZardDemoButtonShapeComponent } from '@zard/components/button/demo/shape';
import { ZardDemoButtonSizeComponent } from '@zard/components/button/demo/size';
import { ZardDemoCardBasicComponent } from '@zard/components/card/demo/basic';
import { ZardDemoCheckboxBasicComponent } from '@zard/components/checkbox/demo/basic';
import { ZardDemoCheckboxDisabledComponent } from '@zard/components/checkbox/demo/disabled';
import { ZardDemoCheckboxShapeComponent } from '@zard/components/checkbox/demo/shape';
import { ZardDemoCheckboxSizeComponent } from '@zard/components/checkbox/demo/size';

export interface ComponentData {
  componentName: string;
  examples: ExampleData[];
}

export interface ExampleData {
  name: string;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
}

export const COMPONENTS: ComponentData[] = [
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
  {
    componentName: 'card',
    examples: [
      {
        name: 'basic',
        component: ZardDemoCardBasicComponent,
      },
    ],
  },
  {
    componentName: 'checkbox',
    examples: [
      {
        name: 'basic',
        component: ZardDemoCheckboxBasicComponent,
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
  },
];
