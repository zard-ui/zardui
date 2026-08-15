import { HOVER_CARD_DEMO_DEFAULT } from '@generated/components/hover-card/demo/default';
import { HOVER_CARD_DEMO_SIDES } from '@generated/components/hover-card/demo/sides';
import { HOVER_CARD_CLI_ADD } from '@generated/installation/cli/add-hover-card';
import { HOVER_CARD_MANUAL_CODE } from '@generated/installation/manual/hover-card';
import { HOVER_CARD_USAGE_CODE, HOVER_CARD_USAGE_IMPORT } from '@generated/usage/hover-card';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoHoverCardDefaultComponent } from './default';
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

export const HOVER_CARD = {
  componentName: 'hover-card',
  componentType: 'hover-card',
  description: 'For sighted users to preview content available behind the link.',
  api: HOVER_CARD_API,
  installData: {
    cliAdd: HOVER_CARD_CLI_ADD,
    manualCode: HOVER_CARD_MANUAL_CODE,
  },
  usage: { importBlock: HOVER_CARD_USAGE_IMPORT, codeBlock: HOVER_CARD_USAGE_CODE },
  composition: HOVER_CARD_COMPOSITION,
  examples: [
    {
      name: 'default',
      component: ZardDemoHoverCardDefaultComponent,
      codeData: HOVER_CARD_DEMO_DEFAULT,
    },
    {
      name: 'sides',
      component: ZardDemoHoverCardSidesComponent,
      codeData: HOVER_CARD_DEMO_SIDES,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
