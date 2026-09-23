import { ALERT_DIALOG_DEMO_BASIC } from '@generated/components/alert-dialog/demo/basic';
import { ALERT_DIALOG_DEMO_DESTRUCTIVE } from '@generated/components/alert-dialog/demo/destructive';
import { ALERT_DIALOG_DEMO_MEDIA } from '@generated/components/alert-dialog/demo/media';
import { ALERT_DIALOG_DEMO_PREVIEW } from '@generated/components/alert-dialog/demo/preview';
import { ALERT_DIALOG_DEMO_SMALL } from '@generated/components/alert-dialog/demo/small';
import { ALERT_DIALOG_DEMO_SMALL_WITH_MEDIA } from '@generated/components/alert-dialog/demo/small-with-media';
import { ALERT_DIALOG_CLI_ADD } from '@generated/installation/cli/add-alert-dialog';
import { ALERT_DIALOG_MANUAL_CODE } from '@generated/installation/manual/alert-dialog';
import { ALERT_DIALOG_USAGE_CODE, ALERT_DIALOG_USAGE_IMPORT } from '@generated/usage/alert-dialog';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoAlertDialogBasicComponent } from './basic';
import { ZardDemoAlertDialogDestructiveComponent } from './destructive';
import { ZardDemoAlertDialogMediaComponent } from './media';
import { ZardDemoAlertDialogPreviewComponent } from './preview';
import { ZardDemoAlertDialogSmallComponent } from './small';
import { ZardDemoAlertDialogSmallWithMediaComponent } from './small-with-media';
import { ALERT_DIALOG_API } from '../doc/api';

const ALERT_DIALOG_COMPOSITION_CODE = `z-alert-dialog
├── z-alert-dialog-header
│   ├── z-alert-dialog-media
│   ├── z-alert-dialog-title
│   └── z-alert-dialog-description
└── z-alert-dialog-footer
    └── [z-alert-dialog-close]`;

const escapeCompositionHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ALERT_DIALOG_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${ALERT_DIALOG_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: ALERT_DIALOG_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const ALERT_DIALOG = {
  api: ALERT_DIALOG_API,
  componentName: 'alert-dialog',
  componentType: 'alert-dialog',
  description: 'A modal dialog that interrupts the user with important content and expects a response.',
  installData: {
    cliAdd: ALERT_DIALOG_CLI_ADD,
    manualCode: ALERT_DIALOG_MANUAL_CODE,
  },
  usage: { importBlock: ALERT_DIALOG_USAGE_IMPORT, codeBlock: ALERT_DIALOG_USAGE_CODE },
  composition: ALERT_DIALOG_COMPOSITION,
  preview: {
    name: 'preview',
    description: 'A basic alert dialog with a title, description, and cancel and continue buttons.',
    component: ZardDemoAlertDialogPreviewComponent,
    codeData: ALERT_DIALOG_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'basic',
      description:
        'The minimal alert dialog: a title, a description and the cancel/continue buttons. In the template the buttons are yours; `[z-alert-dialog-close]` closes without a handler.',
      component: ZardDemoAlertDialogBasicComponent,
      codeData: ALERT_DIALOG_DEMO_BASIC,
    },
    {
      name: 'small',
      description: 'Use `zSize="sm"`, as an input or an option, to make the alert dialog smaller.',
      component: ZardDemoAlertDialogSmallComponent,
      codeData: ALERT_DIALOG_DEMO_SMALL,
    },
    {
      name: 'media',
      description:
        'Add a media element such as an icon above the title: `z-alert-dialog-media` in the template, or a `<ng-template>` passed via `zMedia` to the service.',
      component: ZardDemoAlertDialogMediaComponent,
      codeData: ALERT_DIALOG_DEMO_MEDIA,
    },
    {
      name: 'small-with-media',
      description: 'Combine `zSize="sm"` with the media slot to add a media element to the smaller alert dialog.',
      component: ZardDemoAlertDialogSmallWithMediaComponent,
      codeData: ALERT_DIALOG_DEMO_SMALL_WITH_MEDIA,
    },
    {
      name: 'destructive',
      description:
        'A destructive action: tint the media slot (`class` on `z-alert-dialog-media`, or `zMediaClass`) and make the confirm button destructive (`zType="destructive"`, or `zOkDestructive: true`).',
      component: ZardDemoAlertDialogDestructiveComponent,
      codeData: ALERT_DIALOG_DEMO_DESTRUCTIVE,
    },
  ],
};
