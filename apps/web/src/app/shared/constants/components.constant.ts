import { ZardDemoInputBorderlessComponent } from '@zard/components/input/demo/borderless';
import { ZardDemoSwitchDisabledComponent } from '@zard/components/switch/demo/disabled';
import { ZardDemoInputTextAreaComponent } from '@zard/components/input/demo/text-area';
import { ZardDemoRadioDisabledComponent } from '@zard/components/radio/demo/disabled';
import { ZardDemoSwitchBasicComponent } from '@zard/components/switch/demo/basic';
import { ZardDemoLoaderBasicComponent } from '@zard/components/loader/demo/basic';
import { ZardDemoInputStatusComponent } from '@zard/components/input/demo/status';
import { ZardDemoSwitchSizeComponent } from '@zard/components/switch/demo/size';
import { ZardDemoRadioBasicComponent } from '@zard/components/radio/demo/basic';
import { ZardDemoLoaderSizeComponent } from '@zard/components/loader/demo/size';
import { ZardDemoInputBasicComponent } from '@zard/components/input/demo/basic';
import { ZardDemoRadioSizeComponent } from '@zard/components/radio/demo/size';
import { ZardDemoInputSizeComponent } from '@zard/components/input/demo/size';
import { ZardDemoCardBasicComponent } from '@zard/components/card/demo/basic';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { BUTTON } from '@zard/components/button/demo/button';
import { BADGE } from '@zard/components/badge/demo/badge';
import { ComponentType } from '@angular/cdk/overlay';

export interface ComponentData {
  componentName: string;
  examples: ExampleData[];
}

export interface ExampleData {
  name: string;
  type?: string;
  component: ComponentType<unknown>;
  onlyDemo?: boolean;
}

export const COMPONENTS: ComponentData[] = [
  BADGE,
  BUTTON,
  {
    componentName: 'card',
    examples: [
      {
        name: 'basic',
        component: ZardDemoCardBasicComponent,
      },
    ],
  },
  CHECKBOX,
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
];
