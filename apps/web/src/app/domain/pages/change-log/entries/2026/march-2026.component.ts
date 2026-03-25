import { Component } from '@angular/core';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
  type ChangelogHighlight,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-march-2026',
  standalone: true,
  template: ``,
})
export class March2026Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'March 2026',
    year: 2026,
    monthNumber: 3,
    date: new Date(2026, 2, 1),
    id: '03-2026',
  };

  readonly overview =
    'Complete icon system migration! We replaced the custom `ZardIconComponent` with `@ng-icons/lucide`, bringing better tree-shaking, a wider icon selection, and a simpler API across all components.';

  readonly examples: ChangelogExample[] = [];

  readonly highlights: ChangelogHighlight[] = [
    {
      title: 'Migration to @ng-icons/lucide',
      description:
        'All components now use `NgIcon` from `@ng-icons/core` with icons sourced from `@ng-icons/lucide`. This replaces the deprecated `ZardIconComponent` and the custom icon registry, resulting in better tree-shaking and smaller bundle sizes.',
      icon: 'package',
    },
    {
      title: 'New Icon API',
      description:
        'Icons are now provided at component level using `provideIcons()` in `viewProviders` and rendered with `<ng-icon name="lucideIconName" />`. Import only the icons you need from `@ng-icons/lucide`.',
      icon: 'code',
    },
    {
      title: 'Updated Dependencies',
      description:
        'The `lucide-angular` dependency has been replaced by `@ng-icons/core` and `@ng-icons/lucide`. The CLI `init` command now installs these automatically.',
      icon: 'terminal',
      code: 'npm install @ng-icons/core @ng-icons/lucide',
    },
  ];
}
