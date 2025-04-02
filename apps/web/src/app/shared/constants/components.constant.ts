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
import { ZardDemoLoaderBasicComponent } from '@zard/components/loader/demo/basic';
import { ZardDemoLoaderSizeComponent } from '@zard/components/loader/demo/size';
import { ZardDemoRadioBasicComponent } from '@zard/components/radio/demo/basic';
import { ZardDemoRadioDisabledComponent } from '@zard/components/radio/demo/disabled';
import { ZardDemoRadioSizeComponent } from '@zard/components/radio/demo/size';
import { ZardDemoSwitchBasicComponent } from '@zard/components/switch/demo/basic';
import { ZardDemoSwitchDisabledComponent } from '@zard/components/switch/demo/disabled';
import { ZardDemoSwitchSizeComponent } from '@zard/components/switch/demo/size';
import { ZardDemoProgressBarBasicComponent } from '@zard/components/progress-bar/demo/basic';
import { ZardDemoProgressBarShapeComponent } from '@zard/components/progress-bar/demo/shape';
import { ZardDemoProgressBarSizeComponent } from '@zard/components/progress-bar/demo/size';

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
  {
    componentName: 'loader',
    examples: [
      {
        name: 'basic',
        component: ZardDemoLoaderBasicComponent,
      },
      {
        name: 'size',
        component: ZardDemoLoaderSizeComponent,
      },
    ],
  },
  {
    componentName: 'radio',
    examples: [
      {
        name: 'basic',
        component: ZardDemoRadioBasicComponent,
      },
      {
        name: 'size',
        component: ZardDemoRadioSizeComponent,
      },
      {
        name: 'disabled',
        component: ZardDemoRadioDisabledComponent,
      },
    ],
  },
  {
    componentName: 'switch',
    examples: [
      {
        name: 'basic',
        component: ZardDemoSwitchBasicComponent,
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
  },
  {
    componentName: 'progress-bar',
    examples: [
      {
        name: 'basic',
        component: ZardDemoProgressBarBasicComponent,
      },
      {
        name: 'shape',
        component: ZardDemoProgressBarShapeComponent,
      },
      {
        name: 'size',
        component: ZardDemoProgressBarSizeComponent,
      },
    ],
  },
];
