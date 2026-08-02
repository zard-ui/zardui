import { ACCORDION_DEMO_BASIC } from '@generated/components/accordion/demo/basic';
import { TABS_DEMO_DEFAULT } from '@generated/components/tabs/demo/default';
import { TOOLTIP_DEMO_HOVER } from '@generated/components/tooltip/demo/hover';
import { ACCORDION_CLI_ADD } from '@generated/installation/cli/add-accordion';
import { TABS_CLI_ADD } from '@generated/installation/cli/add-tabs';
import { TOOLTIP_CLI_ADD } from '@generated/installation/cli/add-tooltip';

import { ZardDemoAccordionBasicComponent } from '@zard/components/accordion/demo/basic';
import { ZardDemoTabsDefaultComponent } from '@zard/components/tabs/demo/default';
import { ZardDemoTooltipHoverComponent } from '@zard/components/tooltip/demo/hover';

import { type ChangelogExample } from '../changelog-entry.interface';

export const JULY_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default',
    description:
      'Tabbed interface component for organizing content into separate views with smooth transitions and keyboard navigation.',
    component: ZardDemoTabsDefaultComponent,
    componentName: 'tabs',
    codeData: TABS_DEMO_DEFAULT,
    cliAdd: TABS_CLI_ADD,
  },
  {
    name: 'basic',
    description:
      'Collapsible content panels for organizing information in a compact space with expand/collapse animations.',
    component: ZardDemoAccordionBasicComponent,
    componentName: 'accordion',
    codeData: ACCORDION_DEMO_BASIC,
    cliAdd: ACCORDION_CLI_ADD,
  },
  {
    name: 'hover',
    description: 'Contextual information overlay displayed on hover with customizable positioning and delay settings.',
    component: ZardDemoTooltipHoverComponent,
    componentName: 'tooltip',
    codeData: TOOLTIP_DEMO_HOVER,
    cliAdd: TOOLTIP_CLI_ADD,
  },
];
