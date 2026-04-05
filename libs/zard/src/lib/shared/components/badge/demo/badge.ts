import { BADGE_DEMO_DEFAULT } from '@generated/components/badge/demo/default';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BADGE_MANUAL_CODE } from '@generated/installation/manual/badge';
import { BADGE_USAGE_IMPORT, BADGE_USAGE_CODE } from '@generated/usage/badge';

import { ZardDemoBadgeDefaultComponent } from './default';
import { BADGE_API } from '../doc/api';

export const BADGE = {
  api: BADGE_API,
  componentName: 'badge',
  componentType: 'badge',
  description: 'Displays a badge or a component that looks like a badge.',
  installData: {
    cliAdd: BADGE_CLI_ADD,
    manualCode: BADGE_MANUAL_CODE,
  },
  usage: { importBlock: BADGE_USAGE_IMPORT, codeBlock: BADGE_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoBadgeDefaultComponent,
      codeData: BADGE_DEMO_DEFAULT,
    },
  ],
};
