import { BADGE_DEMO_CUSTOM_COLORS } from '@generated/components/badge/demo/custom-colors';
import { BADGE_DEMO_DEFAULT } from '@generated/components/badge/demo/default';
import { BADGE_DEMO_LINK } from '@generated/components/badge/demo/link';
import { BADGE_DEMO_WITH_ICON } from '@generated/components/badge/demo/with-icon';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BADGE_MANUAL_CODE } from '@generated/installation/manual/badge';
import { BADGE_USAGE_IMPORT, BADGE_USAGE_CODE } from '@generated/usage/badge';

import { ZardDemoBadgeCustomColorsComponent } from '@/shared/components/badge/demo/custom-colors';
import { ZardDemoBadgeLinkComponent } from '@/shared/components/badge/demo/link';
import { ZardDemoBadgeWithIconsComponent } from '@/shared/components/badge/demo/with-icon';

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
    {
      name: 'with-icons',
      component: ZardDemoBadgeWithIconsComponent,
      codeData: BADGE_DEMO_WITH_ICON,
    },
    {
      name: 'link',
      component: ZardDemoBadgeLinkComponent,
      codeData: BADGE_DEMO_LINK,
    },
    {
      name: 'custom-colors',
      component: ZardDemoBadgeCustomColorsComponent,
      codeData: BADGE_DEMO_CUSTOM_COLORS,
    },
  ],
};
