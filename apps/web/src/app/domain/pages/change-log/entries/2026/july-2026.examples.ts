import { FIELD_DEMO_DEFAULT } from '@generated/components/field/demo/default';
import { ITEM_DEMO_DEFAULT } from '@generated/components/item/demo/default';
import { SONNER_DEMO_DEFAULT } from '@generated/components/sonner/demo/default';
import { TEXTAREA_DEMO_DEFAULT } from '@generated/components/textarea/demo/default';
import { FIELD_CLI_ADD } from '@generated/installation/cli/add-field';
import { ITEM_CLI_ADD } from '@generated/installation/cli/add-item';
import { SONNER_CLI_ADD } from '@generated/installation/cli/add-sonner';
import { TEXTAREA_CLI_ADD } from '@generated/installation/cli/add-textarea';

import { ZardDemoFieldDefaultComponent } from '@zard/components/field/demo/default';
import { ZardDemoItemDefaultComponent } from '@zard/components/item/demo/default';
import { ZardDemoSonnerDefaultComponent } from '@zard/components/sonner/demo/default';
import { ZardDemoTextareaDefaultComponent } from '@zard/components/textarea/demo/default';

import { type ChangelogExample } from '../changelog-entry.interface';

export const JULY_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description:
      'Composable building blocks for accessible forms, pairing a control with its label, description, and error message.',
    component: ZardDemoFieldDefaultComponent,
    componentName: 'field',
    codeData: FIELD_DEMO_DEFAULT,
    cliAdd: FIELD_CLI_ADD,
  },
  {
    name: 'default',
    description: 'A versatile row for displaying media, a title, a description, and actions side by side.',
    component: ZardDemoItemDefaultComponent,
    componentName: 'item',
    codeData: ITEM_DEMO_DEFAULT,
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
    name: 'default',
    description:
      'An opinionated toast component with stacking, positioning, and per-type styling. Replaces the old toast.',
    component: ZardDemoSonnerDefaultComponent,
    componentName: 'sonner',
    codeData: SONNER_DEMO_DEFAULT,
    cliAdd: SONNER_CLI_ADD,
  },
];
