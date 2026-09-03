import { SELECT_DEMO_ALIGN_ITEM_WITH_TRIGGER } from '@generated/components/select/demo/align-item-with-trigger';
import { SELECT_DEMO_DISABLED } from '@generated/components/select/demo/disabled';
import { SELECT_DEMO_GROUPS } from '@generated/components/select/demo/groups';
import { SELECT_DEMO_INVALID } from '@generated/components/select/demo/invalid';
import { SELECT_DEMO_MULTI_SELECT } from '@generated/components/select/demo/multi-select';
import { SELECT_DEMO_PREVIEW } from '@generated/components/select/demo/preview';
import { SELECT_DEMO_REACTIVE_FORMS } from '@generated/components/select/demo/reactive-forms';
import { SELECT_DEMO_SCROLLABLE } from '@generated/components/select/demo/scrollable';
import { SELECT_CLI_ADD } from '@generated/installation/cli/add-select';
import { SELECT_MANUAL_CODE } from '@generated/installation/manual/select';
import { SELECT_USAGE_CODE, SELECT_USAGE_IMPORT } from '@generated/usage/select';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoSelectAlignItemWithTriggerComponent } from './align-item-with-trigger';
import { ZardDemoSelectDisabledComponent } from './disabled';
import { ZardDemoSelectGroupsComponent } from './groups';
import { ZardDemoSelectInvalidComponent } from './invalid';
import { ZardDemoSelectMultiSelectComponent } from './multi-select';
import { ZardDemoSelectPreviewComponent } from './preview';
import { ZardDemoSelectReactiveFormsComponent } from './reactive-forms';
import { ZardDemoSelectScrollableComponent } from './scrollable';
import { SELECT_API } from '../doc/api';

const SELECT_COMPOSITION_CODE = `z-select
├── z-select-label
├── z-select-item
├── z-select-group
│   ├── z-select-label
│   ├── z-select-item
│   └── z-select-item
├── z-select-separator
└── z-select-group
    ├── z-select-label
    ├── z-select-item
    └── z-select-item`;

const SELECT_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${SELECT_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: SELECT_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const SELECT = {
  componentName: 'select',
  componentType: 'select',
  api: SELECT_API,
  description: 'Displays a list of options for the user to pick from—triggered by a button.',
  about: {
    description:
      '`z-select` bundles the trigger button and its CDK-overlay listbox into a single component — there is no separate trigger/content pair to compose. Options are declared with `z-select-item`, optionally grouped under `z-select-group`/`z-select-label` and divided with `z-select-separator`. It is a closed list picked without typing; reach for `z-combobox` when the list needs to be filtered by typing, and `z-command` for a standalone filterable action list that is not bound to a form value, such as inside a dialog for a command palette.',
  },
  installData: {
    cliAdd: SELECT_CLI_ADD,
    manualCode: SELECT_MANUAL_CODE,
  },
  usage: { importBlock: SELECT_USAGE_IMPORT, codeBlock: SELECT_USAGE_CODE },
  composition: SELECT_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoSelectPreviewComponent,
    column: false,
    codeData: SELECT_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'align-item-with-trigger',
      description:
        "`[zPosition]` controls how the listbox opens: `'item-aligned'` (the default) aligns the selected item over the trigger; `'popper'` drops the listbox from the trigger's edge instead. Toggle the switch to compare the two.",
      component: ZardDemoSelectAlignItemWithTriggerComponent,
      codeData: SELECT_DEMO_ALIGN_ITEM_WITH_TRIGGER,
    },
    {
      name: 'groups',
      description:
        'Group items with `z-select-group`, label each group with `z-select-label`, and divide groups with `z-select-separator`.',
      component: ZardDemoSelectGroupsComponent,
      codeData: SELECT_DEMO_GROUPS,
    },
    {
      name: 'scrollable',
      description:
        'A select with enough items to require scrolling. Arrow keys, Home/End and Page Up/Down move the highlight and keep it scrolled into view.',
      component: ZardDemoSelectScrollableComponent,
      codeData: SELECT_DEMO_SCROLLABLE,
    },
    {
      name: 'disabled',
      description: '`[zDisabled]` disables the trigger; the select cannot open, receive focus, or change its value.',
      component: ZardDemoSelectDisabledComponent,
      codeData: SELECT_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      description:
        '`[zInvalid]` sets `aria-invalid` on the trigger and applies destructive styling. Composed here inside `z-field` with `data-invalid` and a `z-field-error` for the full validation pattern.',
      component: ZardDemoSelectInvalidComponent,
      codeData: SELECT_DEMO_INVALID,
    },
    {
      name: 'multi-select',
      description:
        '`[zMultiple]` turns the select into a multiselect; `[(zValue)]` becomes a `string[]` and each pick renders as a removable `z-badge` in the trigger. `[zMaxLabelCount]` caps how many badges show before collapsing the rest into a "N more items selected" badge.',
      component: ZardDemoSelectMultiSelectComponent,
      codeData: SELECT_DEMO_MULTI_SELECT,
    },
    {
      name: 'reactive-forms',
      description:
        "`formControlName` binds through `z-select`'s `ControlValueAccessor`, for both a single select and a `zMultiple` one — the multiselect control just carries a `string[]` value.",
      component: ZardDemoSelectReactiveFormsComponent,
      codeData: SELECT_DEMO_REACTIVE_FORMS,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
