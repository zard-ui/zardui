import { ALERT_DEMO_BASIC } from '@generated/components/alert/demo/basic';
import { BADGE_DEMO_VARIANTS } from '@generated/components/badge/demo/variants';
import { BUTTON_DEMO_DEFAULT } from '@generated/components/button/demo/default';
import { CARD_DEMO_PREVIEW } from '@generated/components/card/demo/preview';
import { TABLE_DEMO_SIMPLE } from '@generated/components/table/demo/simple';
import { ALERT_CLI_ADD } from '@generated/installation/cli/add-alert';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BUTTON_CLI_ADD } from '@generated/installation/cli/add-button';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';
import { TABLE_CLI_ADD } from '@generated/installation/cli/add-table';

import { ZardDemoAlertBasicComponent } from '@zard/components/alert/demo/basic';
import { ZardDemoBadgeVariantsComponent } from '@zard/components/badge/demo/variants';
import { ZardDemoButtonDefaultComponent } from '@zard/components/button/demo/default';
import { ZardDemoCardPreviewComponent } from '@zard/components/card/demo/preview';
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
    component: ZardDemoCardPreviewComponent,
    componentName: 'card',
    codeData: CARD_DEMO_PREVIEW,
    cliAdd: CARD_CLI_ADD,
  },
  {
    name: 'variants',
    description:
      'Small label component for displaying status, categories, counts, or tags with various color variants.',
    component: ZardDemoBadgeVariantsComponent,
    componentName: 'badge',
    codeData: BADGE_DEMO_VARIANTS,
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
