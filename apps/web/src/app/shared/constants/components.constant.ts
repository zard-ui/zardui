import { ComponentType } from '@angular/cdk/overlay';
import { ZardDemoBadgeBasicComponent } from '@zard/components/badge/demo/basic';
import { ZardDemoBadgeShapeComponent } from '@zard/components/badge/demo/shape';
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
import { ZardDemoInputBasicComponent } from '@zard/components/input/demo/basic';
import { ZardDemoInputBorderlessComponent } from '@zard/components/input/demo/borderless';
import { ZardDemoInputSizeComponent } from '@zard/components/input/demo/size';
import { ZardDemoInputStatusComponent } from '@zard/components/input/demo/status';
import { ZardDemoInputTextAreaComponent } from '@zard/components/input/demo/text-area';

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
    componentName: 'badge',
    examples: [
      {
        name: 'basic',
        component: ZardDemoBadgeBasicComponent,
      },
      {
        name: 'shape',
        component: ZardDemoBadgeShapeComponent,
      },
    ],
  },
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
  {
    componentName: 'input',
    examples: [
      {
        name: 'basic',
        component: ZardDemoInputBasicComponent,
      },
      {
        name: 'size',
        component: ZardDemoInputSizeComponent,
      },
      {
        name: 'status',
        component: ZardDemoInputStatusComponent,
      },
      {
        name: 'borderless',
        component: ZardDemoInputBorderlessComponent,
      },
      {
        name: 'text-area',
        component: ZardDemoInputTextAreaComponent,
      },
    ],
  },
];
