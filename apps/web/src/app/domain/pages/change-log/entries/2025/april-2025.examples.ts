import { FORM_DEMO_DEFAULT } from '@generated/components/form/demo/default';
import { INPUT_DEMO_DEFAULT } from '@generated/components/input/demo/default';
import { FORM_CLI_ADD } from '@generated/installation/cli/add-form';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';

import { ZardDemoFormDefaultComponent } from '@zard/components/form/demo/default';
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
  {
    name: 'default',
    description: 'Complete form component with field management, validation, error handling, and submission control.',
    component: ZardDemoFormDefaultComponent,
    componentName: 'form',
    codeData: FORM_DEMO_DEFAULT,
    cliAdd: FORM_CLI_ADD,
  },
];
