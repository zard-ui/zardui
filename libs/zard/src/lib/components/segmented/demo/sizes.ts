import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSegmentedComponent } from '../segmented.component';

@Component({
  selector: 'zard-demo-segmented-sizes',
  standalone: true,
  imports: [ZardSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium">Small</label>
        <z-segmented zSize="sm" [zOptions]="options" zDefaultValue="tab1"> </z-segmented>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Default</label>
        <z-segmented [zOptions]="options" zDefaultValue="tab1"> </z-segmented>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Large</label>
        <z-segmented zSize="lg" [zOptions]="options" zDefaultValue="tab1"> </z-segmented>
      </div>
    </div>
  `,
})
export class ZardDemoSegmentedSizesComponent {
  options = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];
}
