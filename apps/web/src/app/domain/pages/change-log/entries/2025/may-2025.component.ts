import { Component } from '@angular/core';

import { ZardDemoCheckboxDefaultComponent } from '@zard/components/checkbox/demo/default';
import { ZardDemoRadioDefaultComponent } from '@zard/components/radio/demo/default';
import { ZardDemoSelectBasicComponent } from '@zard/components/select/demo/default';
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
        'Advanced dropdown select with search functionality, multi-select support, and custom item rendering.',
      component: ZardDemoSelectBasicComponent,
      componentName: 'select',
    },
    {
      name: 'default',
      description: 'Checkbox input component with indeterminate state support and full accessibility features.',
      component: ZardDemoCheckboxDefaultComponent,
      componentName: 'checkbox',
    },
    {
      name: 'default',
      description: 'Radio button group for mutually exclusive options with customizable layouts and orientation.',
      component: ZardDemoRadioDefaultComponent,
      componentName: 'radio',
    },
    {
      name: 'default',
      description: 'Toggle switch component for boolean settings with smooth animation transitions.',
      component: ZardDemoSwitchDefaultComponent,
      componentName: 'switch',
    },
    {
      name: 'default',
      description: 'Range slider for numeric value selection with min/max bounds, step support, and value display.',
      component: ZardDemoSliderDefaultComponent,
      componentName: 'slider',
    },
  ];
}
