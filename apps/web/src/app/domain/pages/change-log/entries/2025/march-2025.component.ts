import { Component } from '@angular/core';

import { ZardDemoAlertBasicComponent } from '@zard/components/alert/demo/basic';
import { ZardDemoBadgeDefaultComponent } from '@zard/components/badge/demo/default';
import { ZardDemoButtonDefaultComponent } from '@zard/components/button/demo/default';
import { ZardDemoCardDefaultComponent } from '@zard/components/card/demo/default';
import { ZardDemoTableSimpleComponent } from '@zard/components/table/demo/simple';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-march-2025',
  standalone: true,
  template: ``,
})
export class March2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'March 2025',
    year: 2025,
    monthNumber: 3,
    date: new Date(2025, 2, 1),
    id: '03-2025',
  };

  readonly overview =
    '🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'default',
      description:
        'Versatile button component with multiple variants (primary, secondary, outline, ghost), sizes, and loading states.',
      component: ZardDemoButtonDefaultComponent,
      componentName: 'button',
    },
    {
      name: 'default',
      description:
        'Container component for grouping related content with optional header, footer, and customizable padding.',
      component: ZardDemoCardDefaultComponent,
      componentName: 'card',
    },
    {
      name: 'default',
      description:
        'Small label component for displaying status, categories, counts, or tags with various color variants.',
      component: ZardDemoBadgeDefaultComponent,
      componentName: 'badge',
    },
    {
      name: 'basic',
      description:
        'Notification component for displaying important information to users with different severity levels.',
      component: ZardDemoAlertBasicComponent,
      componentName: 'alert',
    },
    {
      name: 'simple',
      description: 'Data table component with sorting, filtering, pagination, and customizable column rendering.',
      component: ZardDemoTableSimpleComponent,
      componentName: 'table',
    },
  ];
}
