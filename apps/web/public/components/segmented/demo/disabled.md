```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSegmentedComponent } from '../segmented.component';

@Component({
  selector: 'zard-demo-segmented-disabled',
  standalone: true,
  imports: [ZardSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">With disabled options</label>
        <z-segmented [zOptions]="optionsWithDisabled" zDefaultValue="enabled1"> </z-segmented>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Entire component disabled</label>
        <z-segmented [zOptions]="options" zDefaultValue="tab1" [zDisabled]="true"> </z-segmented>
      </div>
    </div>
  `,
})
export class ZardDemoSegmentedDisabledComponent {
  options = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  optionsWithDisabled = [
    { value: 'enabled1', label: 'Enabled' },
    { value: 'disabled1', label: 'Disabled', disabled: true },
    { value: 'enabled2', label: 'Enabled' },
    { value: 'disabled2', label: 'Disabled', disabled: true },
  ];
}

```