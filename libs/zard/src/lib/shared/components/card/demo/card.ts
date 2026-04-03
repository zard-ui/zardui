import { CARD_DEMO_DEFAULT } from '@generated/components/card/demo/default';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';
import { CARD_MANUAL_CODE } from '@generated/installation/manual/card';

import { ZardDemoCardDefaultComponent } from './default';
import { CARD_API } from '../doc/api';

export const CARD = {
  api: CARD_API,
  componentName: 'card',
  componentType: 'card',
  description: 'Displays a card with header, content, and footer.',
  fullWidth: true,
  installData: {
    cliAdd: CARD_CLI_ADD,
    manualCode: CARD_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoCardDefaultComponent,
      isDefineSizeContainer: false,
      codeData: CARD_DEMO_DEFAULT,
    },
  ],
};
