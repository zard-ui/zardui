import { BREADCRUMB_DEMO_DEFAULT } from '@generated/components/breadcrumb/demo/default';
import { BREADCRUMB_DEMO_DROPDOWN } from '@generated/components/breadcrumb/demo/dropdown';
import { BREADCRUMB_DEMO_ELLIPSIS } from '@generated/components/breadcrumb/demo/ellipsis';
import { BREADCRUMB_DEMO_LINK } from '@generated/components/breadcrumb/demo/link';
import { BREADCRUMB_DEMO_SEPARATOR } from '@generated/components/breadcrumb/demo/separator';
import { BREADCRUMB_CLI_ADD } from '@generated/installation/cli/add-breadcrumb';
import { BREADCRUMB_MANUAL_CODE } from '@generated/installation/manual/breadcrumb';
import { BREADCRUMB_USAGE_IMPORT, BREADCRUMB_USAGE_CODE } from '@generated/usage/breadcrumb';

import { ZardDemoBreadcrumbDefaultComponent } from './default';
import { ZardDemoBreadcrumbDropdownComponent } from './dropdown';
import { ZardDemoBreadcrumbEllipsisComponent } from './ellipsis';
import { ZardDemoBreadcrumbLinkComponent } from './link';
import { ZardDemoBreadcrumbSeparatorComponent } from './separator';
import { BREADCRUMB_API } from '../doc/api';

export const BREADCRUMB = {
  api: BREADCRUMB_API,
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  description: 'Displays the path to the current resource using a hierarchy of links.',
  installData: {
    cliAdd: BREADCRUMB_CLI_ADD,
    manualCode: BREADCRUMB_MANUAL_CODE,
  },
  usage: { importBlock: BREADCRUMB_USAGE_IMPORT, codeBlock: BREADCRUMB_USAGE_CODE },
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
      name: 'dropdown',
      component: ZardDemoBreadcrumbDropdownComponent,
      codeData: BREADCRUMB_DEMO_DROPDOWN,
    },
    {
      name: 'ellipsis',
      component: ZardDemoBreadcrumbEllipsisComponent,
      codeData: BREADCRUMB_DEMO_ELLIPSIS,
    },
    {
      name: 'link',
      component: ZardDemoBreadcrumbLinkComponent,
      codeData: BREADCRUMB_DEMO_LINK,
    },
  ],
};
