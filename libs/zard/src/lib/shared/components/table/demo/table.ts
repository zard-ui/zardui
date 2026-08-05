import { TABLE_DEMO_ACTIONS } from '@generated/components/table/demo/actions';
import { TABLE_DEMO_FOOTER } from '@generated/components/table/demo/footer';
import { TABLE_DEMO_PREVIEW } from '@generated/components/table/demo/preview';
import { TABLE_CLI_ADD } from '@generated/installation/cli/add-table';
import { TABLE_MANUAL_CODE } from '@generated/installation/manual/table';
import { TABLE_USAGE_CODE, TABLE_USAGE_IMPORT } from '@generated/usage/table';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoTableActionsComponent } from '@/shared/components/table/demo/actions';
import { ZardDemoTableFooterComponent } from '@/shared/components/table/demo/footer';
import { ZardDemoTablePreviewComponent } from '@/shared/components/table/demo/preview';
import { TABLE_API } from '@/shared/components/table/doc/api';

const TABLE_COMPOSITION_CODE = `z-table
├── caption[z-table-caption]
├── thead[z-table-header]
│   └── tr[z-table-row]
│       ├── th[z-table-head]
│       ├── th[z-table-head]
│       └── th[z-table-head]
├── tbody[z-table-body]
│   ├── tr[z-table-row]
│   │   ├── td[z-table-cell]
│   │   ├── td[z-table-cell]
│   │   └── td[z-table-cell]
│   └── tr[z-table-row]
│       ├── td[z-table-cell]
│       ├── td[z-table-cell]
│       └── td[z-table-cell]
└── tfoot[z-table-footer]
    └── tr[z-table-row]
        ├── td[z-table-cell]
        └── td[z-table-cell]`;

const TABLE_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${TABLE_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: TABLE_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const TABLE = {
  componentName: 'table',
  componentType: 'table',
  api: TABLE_API,
  description: 'A responsive table component for displaying structured data.',
  installData: {
    cliAdd: TABLE_CLI_ADD,
    manualCode: TABLE_MANUAL_CODE,
  },
  usage: { importBlock: TABLE_USAGE_IMPORT, codeBlock: TABLE_USAGE_CODE },
  composition: TABLE_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoTablePreviewComponent,
    codeData: TABLE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'footer',
      component: ZardDemoTableFooterComponent,
      codeData: TABLE_DEMO_FOOTER,
    },
    {
      name: 'actions',
      description: 'A table showing actions for each row using a `<Dropdown />` component.',
      component: ZardDemoTableActionsComponent,
      codeData: TABLE_DEMO_ACTIONS,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
