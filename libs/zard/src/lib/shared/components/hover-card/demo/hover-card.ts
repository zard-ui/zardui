import { HOVER_CARD_DEMO_DEFAULT } from '@generated/components/hover-card/demo/default';
import { HOVER_CARD_CLI_ADD } from '@generated/installation/cli/add-hover-card';
import { HOVER_CARD_MANUAL_CODE } from '@generated/installation/manual/hover-card';
import { HOVER_CARD_USAGE_CODE, HOVER_CARD_USAGE_IMPORT } from '@generated/usage/hover-card';

import { ZardDemoHoverCardDefaultComponent } from './default';
import { HOVER_CARD_API } from '../doc/api';

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
  examples: [
    {
      name: 'default',
      component: ZardDemoHoverCardDefaultComponent,
      codeData: HOVER_CARD_DEMO_DEFAULT,
    },
  ],
};
