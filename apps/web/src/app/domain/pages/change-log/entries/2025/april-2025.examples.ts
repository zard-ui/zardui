import { INPUT_DEMO_PREVIEW } from '@generated/components/input/demo/preview';
import { INPUT_CLI_ADD } from '@generated/installation/cli/add-input';

import { ZardDemoInputPreviewComponent } from '@zard/components/input/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const APRIL_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description: 'Text input field component with multiple variants, sizes, and built-in validation state indicators.',
    component: ZardDemoInputPreviewComponent,
    componentName: 'input',
    codeData: INPUT_DEMO_PREVIEW,
    cliAdd: INPUT_CLI_ADD,
  },
];
