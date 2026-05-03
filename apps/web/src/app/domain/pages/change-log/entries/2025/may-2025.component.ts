import { Component } from '@angular/core';

import { CHECKBOX_DEMO_DEFAULT } from '@generated/components/checkbox/demo/default';
import { RADIO_GROUP_DEMO_DEFAULT } from '@generated/components/radio-group/demo/default';
import { SELECT_DEMO_DEFAULT } from '@generated/components/select/demo/default';
import { SLIDER_DEMO_DEFAULT } from '@generated/components/slider/demo/default';
import { SWITCH_DEMO_DEFAULT } from '@generated/components/switch/demo/default';

import { ZardDemoCheckboxDefaultComponent } from '@zard/components/checkbox/demo/default';
import { ZardDemoRadioGroupDefaultComponent } from '@zard/components/radio-group/demo/default';
import { ZardDemoSelectDefaultComponent } from '@zard/components/select/demo/default';
import { ZardDemoSliderDefaultComponent } from '@zard/components/slider/demo/default';
import { ZardDemoSwitchDefaultComponent } from '@zard/components/switch/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-may-2025',
  standalone: true,
  template: ``,
})
export class May2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'May 2025',
    year: 2025,
    monthNumber: 5,
    date: new Date(2025, 4, 1),
    id: '05-2025',
  };

  readonly overview =
    'Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'default',
      description:
        'Dropdown select with grouped options, multi-select support, keyboard navigation, and custom item rendering.',
      component: ZardDemoSelectDefaultComponent,
      componentName: 'select',
      codeData: SELECT_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description: 'Checkbox input component with indeterminate state support and full accessibility features.',
      component: ZardDemoCheckboxDefaultComponent,
      componentName: 'checkbox',
      codeData: CHECKBOX_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description: 'Radio button group for mutually exclusive options with customizable layouts and orientation.',
      component: ZardDemoRadioGroupDefaultComponent,
      componentName: 'radio-group',
      codeData: RADIO_GROUP_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description: 'Toggle switch component for boolean settings with smooth animation transitions.',
      component: ZardDemoSwitchDefaultComponent,
      componentName: 'switch',
      codeData: SWITCH_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description: 'Range slider for numeric value selection with min/max bounds, step support, and value display.',
      component: ZardDemoSliderDefaultComponent,
      componentName: 'slider',
      codeData: SLIDER_DEMO_DEFAULT,
    },
  ];
}
