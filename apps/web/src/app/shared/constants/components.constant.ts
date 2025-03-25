import { CHECKBOX } from '@zard/components/checkbox/demo/checkbox';
import { SWITCH } from '@zard/components/switch/demo/switch';
import { LOADER } from '@zard/components/loader/demo/loader';
import { BUTTON } from '@zard/components/button/demo/button';
import { RADIO } from '@zard/components/radio/demo/radio';
import { INPUT } from '@zard/components/input/demo/input';
import { BADGE } from '@zard/components/badge/demo/badge';
import { CARD } from '@zard/components/card/demo/card';
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
import { ZardDemoAccordionBasicComponent } from '@zard/components/accordion/demo/basic';
import { ZardDemoAccordionMultipleComponent } from '@zard/components/accordion/demo/multiple';
import { ZardDemoAccordionCollapsibleComponent } from '@zard/components/accordion/demo/collapsible';
import { ZardDemoAccordionDefaultValueComponent } from '@zard/components/accordion/demo/default-value';
import { ZardDemoLoaderSizeComponent } from '@zard/components/loader/demo/size';
import { ZardDemoRadioBasicComponent } from '@zard/components/radio/demo/basic';
import { ZardDemoRadioDisabledComponent } from '@zard/components/radio/demo/disabled';
import { ZardDemoRadioSizeComponent } from '@zard/components/radio/demo/size';
import { ZardDemoSwitchBasicComponent } from '@zard/components/switch/demo/basic';
import { ZardDemoSwitchDisabledComponent } from '@zard/components/switch/demo/disabled';
import { ZardDemoSwitchSizeComponent } from '@zard/components/switch/demo/size';
import { ZardDemoLoaderBasicComponent } from '@zard/components/loader/demo/basic';

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
    componentName: 'accordion',
    examples: [
      {
        name: 'basic',
        component: ZardDemoAccordionBasicComponent,
      },
      {
        name: 'multiple',
        component: ZardDemoAccordionMultipleComponent,
      },
      {
        name: 'collapsible',
        component: ZardDemoAccordionCollapsibleComponent,
      },
      {
        name: 'default-value',
        component: ZardDemoAccordionDefaultValueComponent,
      },
    ],
  },
];
