import { Component } from '@angular/core';

import { ZardDemoAvatarBasicComponent } from '@zard/components/avatar/demo/basic';
import { ZardDemoBreadcrumbDefaultComponent } from '@zard/components/breadcrumb/demo/default';
import { ZardDemoDividerDefaultComponent } from '@zard/components/divider/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-august-2025',
  standalone: true,
  template: ``,
})
export class August2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'August 2025',
    year: 2025,
    monthNumber: 8,
    date: new Date(2025, 7, 1),
    id: '08-2025',
  };

  readonly overview =
    'Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'basic',
      description: 'User profile image component with automatic fallback to initials and multiple size variants.',
      component: ZardDemoAvatarBasicComponent,
      componentName: 'avatar',
    },
    {
      name: 'default',
      description:
        'Visual divider component for separating content sections with horizontal and vertical orientations.',
      component: ZardDemoDividerDefaultComponent,
      componentName: 'divider',
    },
    {
      name: 'default',
      description: 'Navigation breadcrumb trail showing the current page location within a hierarchical structure.',
      component: ZardDemoBreadcrumbDefaultComponent,
      componentName: 'breadcrumb',
    },
  ];
}
