import { Component } from '@angular/core';

import { ZardDemoLoaderDefaultComponent } from '@zard/components/loader/demo/default';
import { ZardDemoProgressBarBasicComponent } from '@zard/components/progress-bar/demo/basic';
import { ZardDemoSkeletonDefaultComponent } from '@zard/components/skeleton/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-september-2025',
  standalone: true,
  template: ``,
})
export class September2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'September 2025',
    year: 2025,
    monthNumber: 9,
    date: new Date(2025, 8, 1),
    id: '09-2025',
  };

  readonly overview =
    'Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'basic',
      description:
        'Visual progress indicator with customizable variants for tracking task completion and loading states.',
      component: ZardDemoProgressBarBasicComponent,
      componentName: 'progress-bar',
    },
    {
      name: 'default',
      description:
        'Loading placeholder component for better perceived performance during content loading with pulse animation.',
      component: ZardDemoSkeletonDefaultComponent,
      componentName: 'skeleton',
    },
    {
      name: 'default',
      description: 'Animated loading spinner with multiple size variants for indicating async operations in progress.',
      component: ZardDemoLoaderDefaultComponent,
      componentName: 'loader',
    },
  ];
}
