import { SELECT_DEMO_ALIGN_ITEM } from '@generated/components/select/demo/align-item';
import { SELECT_DEMO_DEFAULT } from '@generated/components/select/demo/default';
import { SELECT_DEMO_DISABLED } from '@generated/components/select/demo/disabled';
import { SELECT_DEMO_GROUPS } from '@generated/components/select/demo/groups';
import { SELECT_DEMO_INVALID } from '@generated/components/select/demo/invalid';
import { SELECT_DEMO_MULTI_SELECT } from '@generated/components/select/demo/multi-select';
import { SELECT_DEMO_RTL } from '@generated/components/select/demo/rtl';
import { SELECT_DEMO_SCROLLABLE } from '@generated/components/select/demo/scrollable';
import { SELECT_CLI_ADD } from '@generated/installation/cli/add-select';
import { SELECT_MANUAL_CODE } from '@generated/installation/manual/select';
import { SELECT_USAGE_CODE, SELECT_USAGE_IMPORT } from '@generated/usage/select';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoSelectAlignItemComponent } from './align-item';
import { ZardDemoSelectDefaultComponent } from './default';
import { ZardDemoSelectDisabledComponent } from './disabled';
import { ZardDemoSelectGroupsComponent } from './groups';
import { ZardDemoSelectInvalidComponent } from './invalid';
import { ZardDemoMultiSelectBasicComponent } from './multi-select';
import { ZardDemoSelectRtlComponent } from './rtl';
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
  installData: {
    cliAdd: SELECT_CLI_ADD,
    manualCode: SELECT_MANUAL_CODE,
  },
  usage: { importBlock: SELECT_USAGE_IMPORT, codeBlock: SELECT_USAGE_CODE },
  composition: SELECT_COMPOSITION,
  examples: [
    {
      name: 'default',
      component: ZardDemoSelectDefaultComponent,
      codeData: SELECT_DEMO_DEFAULT,
    },
    {
      name: 'align-item',
      component: ZardDemoSelectAlignItemComponent,
      codeData: SELECT_DEMO_ALIGN_ITEM,
    },
    {
      name: 'groups',
      component: ZardDemoSelectGroupsComponent,
      codeData: SELECT_DEMO_GROUPS,
    },
    {
      name: 'scrollable',
      component: ZardDemoSelectScrollableComponent,
      codeData: SELECT_DEMO_SCROLLABLE,
    },
    {
      name: 'disabled',
      component: ZardDemoSelectDisabledComponent,
      codeData: SELECT_DEMO_DISABLED,
    },
    {
      name: 'invalid',
      component: ZardDemoSelectInvalidComponent,
      codeData: SELECT_DEMO_INVALID,
    },
    {
      name: 'rtl',
      component: ZardDemoSelectRtlComponent,
      codeData: SELECT_DEMO_RTL,
    },
    {
      name: 'multi-select',
      component: ZardDemoMultiSelectBasicComponent,
      codeData: SELECT_DEMO_MULTI_SELECT,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
