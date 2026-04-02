import { BADGE_DEMO_DEFAULT } from '@generated/components/badge/demo/default';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BADGE_MANUAL_CODE } from '@generated/installation/manual/badge';

import { ZardDemoBadgeDefaultComponent } from './default';

export const BADGE = {
  componentName: 'badge',
  componentType: 'badge',
  description: 'Displays a badge or a component that looks like a badge.',
  installData: {
    cliAdd: BADGE_CLI_ADD,
    manualCode: BADGE_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoBadgeDefaultComponent,
      codeData: BADGE_DEMO_DEFAULT,
    },
  ],
};
