import { FIELD_DEMO_PREVIEW } from '@generated/components/field/demo/preview';
import { ITEM_DEMO_PREVIEW } from '@generated/components/item/demo/preview';
import { SONNER_DEMO_PREVIEW } from '@generated/components/sonner/demo/preview';
import { TEXTAREA_DEMO_DEFAULT } from '@generated/components/textarea/demo/default';
import { FIELD_CLI_ADD } from '@generated/installation/cli/add-field';
import { ITEM_CLI_ADD } from '@generated/installation/cli/add-item';
import { SONNER_CLI_ADD } from '@generated/installation/cli/add-sonner';
import { TEXTAREA_CLI_ADD } from '@generated/installation/cli/add-textarea';

import { ZardDemoFieldPreviewComponent } from '@zard/components/field/demo/preview';
import { ZardDemoItemPreviewComponent } from '@zard/components/item/demo/preview';
import { ZardDemoSonnerPreviewComponent } from '@zard/components/sonner/demo/preview';
import { ZardDemoTextareaDefaultComponent } from '@zard/components/textarea/demo/default';

import { type ChangelogExample } from '../changelog-entry.interface';

export const JULY_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description:
      'Composable building blocks for accessible forms, pairing a control with its label, description, and error message.',
    component: ZardDemoFieldPreviewComponent,
    componentName: 'field',
    codeData: FIELD_DEMO_PREVIEW,
    cliAdd: FIELD_CLI_ADD,
  },
  {
    name: 'default',
    description: 'A versatile row for displaying media, a title, a description, and actions side by side.',
    component: ZardDemoItemPreviewComponent,
    componentName: 'item',
    codeData: ITEM_DEMO_PREVIEW,
    cliAdd: ITEM_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Multi-line text input with the same variants, sizes, and validation states as the single-line input.',
    component: ZardDemoTextareaDefaultComponent,
    componentName: 'textarea',
    codeData: TEXTAREA_DEMO_DEFAULT,
    cliAdd: TEXTAREA_CLI_ADD,
  },
  {
    name: 'preview',
    description:
      'An opinionated toast component with stacking, positioning, and per-type styling. Replaces the old toast.',
    component: ZardDemoSonnerPreviewComponent,
    componentName: 'sonner',
    codeData: SONNER_DEMO_PREVIEW,
    cliAdd: SONNER_CLI_ADD,
  },
];
