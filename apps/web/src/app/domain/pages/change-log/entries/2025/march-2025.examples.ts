import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { BADGE_DEMO_DEFAULT } from '@generated/components/badge/demo/default';
import { BUTTON_DEMO_DEFAULT } from '@generated/components/button/demo/default';
import { CARD_DEMO_DEFAULT } from '@generated/components/card/demo/default';
import { TABLE_DEMO_SIMPLE } from '@generated/components/table/demo/simple';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BUTTON_CLI_ADD } from '@generated/installation/cli/add-button';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';
import { TABLE_CLI_ADD } from '@generated/installation/cli/add-table';

import { ZardDemoAlertBasicComponent } from '@zard/components/alert/demo/basic';
import { ZardDemoBadgeDefaultComponent } from '@zard/components/badge/demo/default';
import { ZardDemoButtonDefaultComponent } from '@zard/components/button/demo/default';
import { ZardDemoCardDefaultComponent } from '@zard/components/card/demo/default';
import { ZardDemoTableSimpleComponent } from '@zard/components/table/demo/simple';

import { type ChangelogExample } from '../changelog-entry.interface';

export const MARCH_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description:
      'Versatile button component with multiple variants (primary, secondary, outline, ghost), sizes, and loading states.',
    component: ZardDemoButtonDefaultComponent,
    componentName: 'button',
    codeData: BUTTON_DEMO_DEFAULT,
    cliAdd: BUTTON_CLI_ADD,
  },
  {
    name: 'default',
    description:
      'Container component for grouping related content with optional header, footer, and customizable padding.',
    component: ZardDemoCardDefaultComponent,
    componentName: 'card',
    codeData: CARD_DEMO_DEFAULT,
    cliAdd: CARD_CLI_ADD,
  },
  {
    name: 'default',
    description:
      'Small label component for displaying status, categories, counts, or tags with various color variants.',
    component: ZardDemoBadgeDefaultComponent,
    componentName: 'badge',
    codeData: BADGE_DEMO_DEFAULT,
    cliAdd: BADGE_CLI_ADD,
  },
  {
    name: 'basic',
    description: 'Notification component for displaying important information to users with different severity levels.',
    component: ZardDemoAlertBasicComponent,
    componentName: 'alert',
    codeData: ALERT_DEMO_BASIC,
    cliAdd: ALERT_CLI_ADD,
  },
  {
    name: 'simple',
    description: 'Data table component with sorting, filtering, pagination, and customizable column rendering.',
    component: ZardDemoTableSimpleComponent,
    componentName: 'table',
    codeData: TABLE_DEMO_SIMPLE,
    cliAdd: TABLE_CLI_ADD,
  },
];
