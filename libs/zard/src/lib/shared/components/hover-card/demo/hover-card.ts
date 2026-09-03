import { HOVER_CARD_DEMO_DELAY } from '@generated/components/hover-card/demo/delay';
import { HOVER_CARD_DEMO_PREVIEW } from '@generated/components/hover-card/demo/preview';
import { HOVER_CARD_DEMO_SIDES } from '@generated/components/hover-card/demo/sides';
import { HOVER_CARD_CLI_ADD } from '@generated/installation/cli/add-hover-card';
import { HOVER_CARD_MANUAL_CODE } from '@generated/installation/manual/hover-card';
import { HOVER_CARD_USAGE_CODE, HOVER_CARD_USAGE_IMPORT } from '@generated/usage/hover-card';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoHoverCardDelayComponent } from './delay';
import { ZardDemoHoverCardPreviewComponent } from './preview';
import { ZardDemoHoverCardSidesComponent } from './sides';
import { HOVER_CARD_API } from '../doc/api';

const HOVER_CARD_COMPOSITION_CODE = `trigger[zHoverCard]
└── ng-template
    └── z-hover-card`;

const HOVER_CARD_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${HOVER_CARD_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: HOVER_CARD_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

/** Documentation, installation, usage, and demo metadata for the Hover Card page. */
export const HOVER_CARD = {
  componentName: 'hover-card',
  componentType: 'hover-card',
  description: 'For sighted users to preview content available behind the link.',
  about: {
    description:
      'Reach for `[zHoverCard]` with `z-hover-card` when hovering or focusing a trigger should surface a rich, non-essential preview — a profile card, a link summary — that stays open while the pointer or focus moves into it. Use `[zTooltip]`/`z-tooltip` instead for a short text label, and `[zPopover]`/`z-popover` when the panel holds interactive content that should open on click rather than hover.',
  },
  api: HOVER_CARD_API,
  installData: {
    cliAdd: HOVER_CARD_CLI_ADD,
    manualCode: HOVER_CARD_MANUAL_CODE,
  },
  usage: { importBlock: HOVER_CARD_USAGE_IMPORT, codeBlock: HOVER_CARD_USAGE_CODE },
  composition: HOVER_CARD_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoHoverCardPreviewComponent,
    codeData: HOVER_CARD_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'sides',
      description:
        'Set `zPlacement` to `top`, `bottom`, `left` or `right` to choose which side of the trigger the hover card opens on. The overlay flips to another side automatically when the preferred placement does not fit in the viewport.',
      component: ZardDemoHoverCardSidesComponent,
      codeData: HOVER_CARD_DEMO_SIDES,
    },
    {
      name: 'delay',
      description:
        'Hover intent defaults to a 700ms open delay and a 300ms close delay — long enough to ignore a passing cursor, unlike a tooltip. Override either with the `zOpenDelay` and `zCloseDelay` inputs, in milliseconds.',
      component: ZardDemoHoverCardDelayComponent,
      codeData: HOVER_CARD_DEMO_DELAY,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
