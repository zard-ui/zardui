```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSegmentedComponent } from '../segmented.component';

@Component({
  selector: 'zard-demo-segmented-default',
  standalone: true,
  imports: [ZardSegmentedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <z-segmented [zOptions]="options" zDefaultValue="all" (zChange)="onSelectionChange($event)"> </z-segmented> `,
})
export class ZardDemoSegmentedDefaultComponent {
  options = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'archived', label: 'Archived' },
  ];

  onSelectionChange(value: string) {
    console.log('Selected:', value);
  }
}

```
