import { DIALOG_DEMO_CUSTOM_CLOSE } from '@generated/components/dialog/demo/custom-close';
import { DIALOG_DEMO_NO_CLOSE_BUTTON } from '@generated/components/dialog/demo/no-close-button';
import { DIALOG_DEMO_PREVIEW } from '@generated/components/dialog/demo/preview';
import { DIALOG_DEMO_SCROLLABLE_CONTENT } from '@generated/components/dialog/demo/scrollable-content';
import { DIALOG_DEMO_STICKY_FOOTER } from '@generated/components/dialog/demo/sticky-footer';
import { DIALOG_CLI_ADD } from '@generated/installation/cli/add-dialog';
import { DIALOG_MANUAL_CODE } from '@generated/installation/manual/dialog';
import { DIALOG_USAGE_CODE, DIALOG_USAGE_IMPORT } from '@generated/usage/dialog';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoDialogCustomCloseComponent } from './custom-close';
import { ZardDemoDialogNoCloseButtonComponent } from './no-close-button';
import { ZardDemoDialogPreviewComponent } from './preview';
import { ZardDemoDialogScrollableContentComponent } from './scrollable-content';
import { ZardDemoDialogStickyFooterComponent } from './sticky-footer';
import { DIALOG_API } from '../doc/api';

const DIALOG_COMPOSITION_CODE = `z-dialog
├── z-dialog-header
│   ├── z-dialog-title
│   └── z-dialog-description
├── (your content)
└── z-dialog-footer
    └── [z-dialog-close]`;

const escapeCompositionHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DIALOG_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${DIALOG_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: DIALOG_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const DIALOG = {
  componentName: 'dialog',
  componentType: 'dialog',
  description: 'Visually or semantically separates content.',
  api: DIALOG_API,
  installData: {
    cliAdd: DIALOG_CLI_ADD,
    manualCode: DIALOG_MANUAL_CODE,
  },
  usage: { importBlock: DIALOG_USAGE_IMPORT, codeBlock: DIALOG_USAGE_CODE },
  composition: DIALOG_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoDialogPreviewComponent,
    codeData: DIALOG_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'custom-close',
      description:
        'Replace the default footer with your own: a `z-dialog-footer` with a `[z-dialog-close]` button works in both forms, the service one with `zHideFooter: true`.',
      component: ZardDemoDialogCustomCloseComponent,
      codeData: DIALOG_DEMO_CUSTOM_CLOSE,
    },
    {
      name: 'no-close-button',
      description:
        'Set `[zClosable]="false"` in the template, or `zClosable: false` in the options, to hide the close button; press Escape or click outside the dialog to close it.',
      component: ZardDemoDialogNoCloseButtonComponent,
      codeData: DIALOG_DEMO_NO_CLOSE_BUTTON,
    },
    {
      name: 'sticky-footer',
      description: 'Keep actions visible while the content scrolls.',
      component: ZardDemoDialogStickyFooterComponent,
      codeData: DIALOG_DEMO_STICKY_FOOTER,
    },
    {
      name: 'scrollable-content',
      description: 'Long content can scroll while the header stays in view.',
      component: ZardDemoDialogScrollableContentComponent,
      codeData: DIALOG_DEMO_SCROLLABLE_CONTENT,
    },
  ],
};
