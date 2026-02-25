import { Component } from '@angular/core';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
  type ChangelogHighlight,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-december-2025',
  standalone: true,
  template: ``,
})
export class December2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'December 2025',
    year: 2025,
    monthNumber: 12,
    date: new Date(2025, 11, 1),
    id: '12-2025',
  };

  readonly overview =
    'Major infrastructure improvements this month! We focused on developer experience with a new provider system, CLI enhancements with our own private registry, and streamlined dark-mode setup.';

  readonly examples: ChangelogExample[] = [];

  readonly highlights: ChangelogHighlight[] = [
    {
      title: 'provideZard()',
      description:
        'New provider function for streamlined app configuration. Add event manager plugins and other Zard utilities with a single function call in your app.config.ts.',
      icon: 'zap',
      code: 'provideZard()',
    },
    {
      title: 'Private Registry System',
      description:
        'The CLI now uses our own private registry instead of fetching from GitHub. This brings significant performance improvements, better version control, and more reliable component installations.',
      icon: 'package',
    },
    {
      title: 'Dark Mode via CLI',
      description:
        'Adding dark-mode support to your project is now as simple as running a single CLI command. It automatically configures everything you need.',
      icon: 'moon',
      code: 'npx zard-cli@latest add dark-mode',
    },
  ];
}
