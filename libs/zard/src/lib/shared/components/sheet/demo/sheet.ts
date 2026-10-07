import { SHEET_DEMO_NO_CLOSE_BUTTON } from '@generated/components/sheet/demo/no-close-button';
import { SHEET_DEMO_PREVIEW } from '@generated/components/sheet/demo/preview';
import { SHEET_DEMO_SIDE } from '@generated/components/sheet/demo/side';
import { SHEET_CLI_ADD } from '@generated/installation/cli/add-sheet';
import { SHEET_MANUAL_CODE } from '@generated/installation/manual/sheet';
import { SHEET_USAGE_CODE, SHEET_USAGE_IMPORT } from '@generated/usage/sheet';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoSheetNoCloseButtonComponent } from './no-close-button';
import { ZardDemoSheetPreviewComponent } from './preview';
import { ZardDemoSheetSideComponent } from './side';
import { SHEET_API } from '../doc/api';

const SHEET_COMPOSITION_CODE = `z-sheet
├── z-sheet-header
│   ├── z-sheet-title
│   └── z-sheet-description
├── (your content)
└── z-sheet-footer
    └── [z-sheet-close]`;

const escapeCompositionHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SHEET_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${SHEET_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: SHEET_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const SHEET = {
  componentName: 'sheet',
  componentType: 'sheet',
  api: SHEET_API,
  description: 'Extends the Dialog component to display content that complements the main content of the screen.',
  installData: {
    cliAdd: SHEET_CLI_ADD,
    manualCode: SHEET_MANUAL_CODE,
  },
  usage: { importBlock: SHEET_USAGE_IMPORT, codeBlock: SHEET_USAGE_CODE },
  composition: SHEET_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoSheetPreviewComponent,
    codeData: SHEET_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'side',
      description:
        'Use `zSide`, as an input or an option, to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.',
      component: ZardDemoSheetSideComponent,
      codeData: SHEET_DEMO_SIDE,
    },
    {
      name: 'no-close-button',
      description:
        'Set `[zClosable]="false"` in the template, or `zClosable: false` in the options, to hide the close button; press Escape or click outside the sheet to close it.',
      component: ZardDemoSheetNoCloseButtonComponent,
      codeData: SHEET_DEMO_NO_CLOSE_BUTTON,
    },
  ],
};
