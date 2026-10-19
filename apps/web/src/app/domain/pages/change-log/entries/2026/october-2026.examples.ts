import { CARD_DEMO_RTL } from '@generated/components/card/demo/rtl';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';

import { ZardDemoCardRtlComponent } from '@zard/components/card/demo/rtl';

import { type ChangelogExample } from '../changelog-entry.interface';

export const OCTOBER_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'rtl',
    description: 'The same card in Arabic, Hebrew and English: pick a language and the layout mirrors with it.',
    component: ZardDemoCardRtlComponent,
    componentName: 'card',
    codeData: CARD_DEMO_RTL,
    cliAdd: CARD_CLI_ADD,
    type: 'rtl',
  },
];
