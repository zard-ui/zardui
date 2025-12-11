import { Component } from '@angular/core';

import { ZardDemoFormDefaultComponent } from '@zard/components/form/demo/default';
import { ZardDemoInputDefaultComponent } from '@zard/components/input/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-april-2025',
  standalone: true,
  template: ``,
})
export class April2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'April 2025',
    year: 2025,
    monthNumber: 4,
    date: new Date(2025, 3, 1),
    id: '04-2025',
  };

  readonly overview =
    'Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'default',
      description:
        'Text input field component with multiple variants, sizes, and built-in validation state indicators.',
      component: ZardDemoInputDefaultComponent,
      componentName: 'input',
    },
    {
      name: 'default',
      description: 'Complete form component with field management, validation, error handling, and submission control.',
      component: ZardDemoFormDefaultComponent,
      componentName: 'form',
    },
  ];
}
