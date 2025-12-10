import { Component } from '@angular/core';

import { ZardDemoEmptyDefaultComponent } from '@zard/components/empty/demo/default';
import { ZardDemoSheetBasicComponent } from '@zard/components/sheet/demo/basic';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-october-2025',
  standalone: true,
  template: ``,
})
export class October2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'October 2025',
    year: 2025,
    monthNumber: 10,
    date: new Date(2025, 9, 1),
    id: '10-2025',
  };

  readonly overview =
    'Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'basic',
      description:
        'A versatile sheet component for side panels and overlays with customizable positioning and smooth transitions.',
      component: ZardDemoSheetBasicComponent,
      componentName: 'sheet',
    },
    {
      name: 'default',
      description: 'Clean empty state component for "no data" scenarios with customizable messages and icons.',
      component: ZardDemoEmptyDefaultComponent,
      componentName: 'empty',
    },
  ];
}
