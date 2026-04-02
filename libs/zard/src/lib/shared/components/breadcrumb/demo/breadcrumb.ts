import { BREADCRUMB_DEMO_DEFAULT } from '@generated/components/breadcrumb/demo/default';
import { BREADCRUMB_DEMO_ELLIPSIS } from '@generated/components/breadcrumb/demo/ellipsis';
import { BREADCRUMB_DEMO_SEPARATOR } from '@generated/components/breadcrumb/demo/separator';
import { BREADCRUMB_CLI_ADD } from '@generated/installation/cli/add-breadcrumb';
import { BREADCRUMB_MANUAL_CODE } from '@generated/installation/manual/breadcrumb';

import { ZardDemoBreadcrumbDefaultComponent } from './default';
import { ZardDemoBreadcrumbEllipsisComponent } from './ellipsis';
import { ZardDemoBreadcrumbSeparatorComponent } from './separator';

export const BREADCRUMB = {
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  description: 'Displays the path to the current resource using a hierarchy of links.',
  installData: {
    cliAdd: BREADCRUMB_CLI_ADD,
    manualCode: BREADCRUMB_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoBreadcrumbDefaultComponent,
      codeData: BREADCRUMB_DEMO_DEFAULT,
    },
    {
      name: 'separator',
      component: ZardDemoBreadcrumbSeparatorComponent,
      codeData: BREADCRUMB_DEMO_SEPARATOR,
    },
    {
      name: 'ellipsis',
      component: ZardDemoBreadcrumbEllipsisComponent,
      codeData: BREADCRUMB_DEMO_ELLIPSIS,
    },
  ],
};
