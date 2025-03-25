import { ZardDemoSwitchDisabledComponent } from '@zard/components/switch/demo/disabled';
import { ZardDemoRadioDisabledComponent } from '@zard/components/radio/demo/disabled';
import { ZardDemoSwitchBasicComponent } from '@zard/components/switch/demo/basic';
import { ZardDemoLoaderBasicComponent } from '@zard/components/loader/demo/basic';
import { ZardDemoSwitchSizeComponent } from '@zard/components/switch/demo/size';
import { ZardDemoRadioBasicComponent } from '@zard/components/radio/demo/basic';
import { ZardDemoLoaderSizeComponent } from '@zard/components/loader/demo/size';
import { ZardDemoRadioSizeComponent } from '@zard/components/radio/demo/size';
import { ZardDemoCardBasicComponent } from '@zard/components/card/demo/basic';
import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { BUTTON } from '@zard/components/button/demo/button';
import { INPUT } from '@zard/components/input/demo/input';
import { BADGE } from '@zard/components/badge/demo/badge';
import { ComponentType } from '@angular/cdk/overlay';

export interface ComponentData {
  componentName: string;
  examples: ExampleData[];
}

export interface ExampleData {
  name: string;
  type?: string;
  column?: boolean;
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
  INPUT,
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
