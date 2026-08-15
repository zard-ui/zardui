import { INPUT_DEMO_DEFAULT } from '@generated/components/input/demo/default';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';

import { ZardDemoInputDefaultComponent } from '@zard/components/input/demo/default';

import { type ChangelogExample } from '../changelog-entry.interface';

export const APRIL_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description: 'Text input field component with multiple variants, sizes, and built-in validation state indicators.',
    component: ZardDemoInputDefaultComponent,
    componentName: 'input',
    codeData: INPUT_DEMO_DEFAULT,
    cliAdd: INPUT_CLI_ADD,
  },
];
