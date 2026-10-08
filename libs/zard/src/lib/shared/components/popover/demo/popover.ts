import { POPOVER_DEMO_ALIGN } from '@generated/components/popover/demo/align';
import { POPOVER_DEMO_BASIC } from '@generated/components/popover/demo/basic';
import { POPOVER_DEMO_CLOSE_ON_ACTION } from '@generated/components/popover/demo/close-on-action';
import { POPOVER_DEMO_FORM } from '@generated/components/popover/demo/form';
import { POPOVER_DEMO_HOVER } from '@generated/components/popover/demo/hover';
import { POPOVER_DEMO_PLACEMENT } from '@generated/components/popover/demo/placement';
import { POPOVER_DEMO_PREVIEW } from '@generated/components/popover/demo/preview';
import { POPOVER_CLI_ADD } from '@generated/installation/cli/add-popover';
import { POPOVER_MANUAL_CODE } from '@generated/installation/manual/popover';
import { POPOVER_USAGE_CODE, POPOVER_USAGE_IMPORT } from '@generated/usage/popover';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoPopoverAlignComponent } from '@/shared/components/popover/demo/align';
import { ZardDemoPopoverBasicComponent } from '@/shared/components/popover/demo/basic';
import { ZardDemoPopoverCloseOnActionComponent } from '@/shared/components/popover/demo/close-on-action';
import { ZardDemoPopoverFormComponent } from '@/shared/components/popover/demo/form';
import { ZardDemoPopoverHoverComponent } from '@/shared/components/popover/demo/hover';
import { ZardDemoPopoverPlacementComponent } from '@/shared/components/popover/demo/placement';
import { ZardDemoPopoverPreviewComponent } from '@/shared/components/popover/demo/preview';
import { POPOVER_API } from '@/shared/components/popover/doc/api';

const POPOVER_COMPOSITION_CODE = `button[zPopover]
└── ng-template
    └── z-popover
        └── div[z-popover-header]
            ├── h4[z-popover-title]
            └── p[z-popover-description]`;

const POPOVER_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${POPOVER_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: POPOVER_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const POPOVER = {
  componentName: 'popover',
  componentType: 'popover',
  api: POPOVER_API,
  description: 'Displays rich content in a portal, triggered by a button.',
  installData: {
    cliAdd: POPOVER_CLI_ADD,
    manualCode: POPOVER_MANUAL_CODE,
  },
  usage: { importBlock: POPOVER_USAGE_IMPORT, codeBlock: POPOVER_USAGE_CODE },
  composition: POPOVER_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoPopoverPreviewComponent,
    codeData: POPOVER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'A popover with a header, a title and a description, aligned to the start of the trigger.',
      component: ZardDemoPopoverBasicComponent,
      codeData: POPOVER_DEMO_BASIC,
    },
    {
      name: 'align',
      description:
        'Set `zAlign` to `start`, `center` or `end` to align the popover along the side chosen by `zPlacement`.',
      component: ZardDemoPopoverAlignComponent,
      codeData: POPOVER_DEMO_ALIGN,
    },
    {
      name: 'form',
      description: 'A popover holding a form built with the `z-field` components.',
      component: ZardDemoPopoverFormComponent,
      codeData: POPOVER_DEMO_FORM,
    },
    {
      name: 'placement',
      description:
        'Set `zPlacement` to `top`, `bottom`, `left` or `right` to choose which side of the trigger the popover opens on. The overlay flips to another side automatically when the preferred placement does not fit in the viewport.',
      component: ZardDemoPopoverPlacementComponent,
      codeData: POPOVER_DEMO_PLACEMENT,
    },
    {
      name: 'hover',
      description:
        'Set `zTrigger="hover"` to open the popover on pointer enter instead of click. Prefer `[zHoverCard]` for a hover-triggered preview of non-essential content — it adds open/close delays that a hover-triggered popover does not have, so a passing cursor does not trigger it.',
      component: ZardDemoPopoverHoverComponent,
      codeData: POPOVER_DEMO_HOVER,
    },
    {
      name: 'close-on-action',
      description:
        'Read the `zPopover` directive with `viewChild` and call `hide()` to close the popover programmatically — for example, after an in-panel action like a save button completes.',
      component: ZardDemoPopoverCloseOnActionComponent,
      codeData: POPOVER_DEMO_CLOSE_ON_ACTION,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
