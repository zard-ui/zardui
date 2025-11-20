import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSegmentedComponent } from '../segmented.component';

@Component({
  selector: 'zard-demo-segmented-default',
  imports: [ZardSegmentedComponent],
  standalone: true,
  template: ` <z-segmented [zOptions]="options" zDefaultValue="all" (zChange)="onSelectionChange($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
