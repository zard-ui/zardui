import { BREADCRUMB_DEMO_BASIC } from '@generated/components/breadcrumb/demo/basic';
import { BREADCRUMB_DEMO_COLLAPSED } from '@generated/components/breadcrumb/demo/collapsed';
import { BREADCRUMB_DEMO_CUSTOM_SEPARATOR } from '@generated/components/breadcrumb/demo/custom-separator';
import { BREADCRUMB_DEMO_DROPDOWN } from '@generated/components/breadcrumb/demo/dropdown';
import { BREADCRUMB_DEMO_LINK } from '@generated/components/breadcrumb/demo/link';
import { BREADCRUMB_DEMO_PREVIEW } from '@generated/components/breadcrumb/demo/preview';
import { BREADCRUMB_CLI_ADD } from '@generated/installation/cli/add-breadcrumb';
import { BREADCRUMB_MANUAL_CODE } from '@generated/installation/manual/breadcrumb';
import { BREADCRUMB_USAGE_IMPORT, BREADCRUMB_USAGE_CODE } from '@generated/usage/breadcrumb';

import { ZardDemoBreadcrumbBasicComponent } from './basic';
import { ZardDemoBreadcrumbCollapsedComponent } from './collapsed';
import { ZardDemoBreadcrumbCustomSeparatorComponent } from './custom-separator';
import { ZardDemoBreadcrumbDropdownComponent } from './dropdown';
import { ZardDemoBreadcrumbLinkComponent } from './link';
import { ZardDemoBreadcrumbPreviewComponent } from './preview';
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
  preview: {
    name: 'preview',
    component: ZardDemoBreadcrumbPreviewComponent,
    codeData: BREADCRUMB_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'A basic breadcrumb with `z-breadcrumb-link` elements using plain `href` targets.',
      component: ZardDemoBreadcrumbBasicComponent,
      codeData: BREADCRUMB_DEMO_BASIC,
    },
    {
      name: 'custom-separator',
      description:
        'Project your own `li[z-breadcrumb-separator]` elements to replace the default chevron between items.',
      component: ZardDemoBreadcrumbCustomSeparatorComponent,
      codeData: BREADCRUMB_DEMO_CUSTOM_SEPARATOR,
    },
    {
      name: 'dropdown',
      description:
        'Compose a `z-breadcrumb-item` with `[z-dropdown]` and `z-dropdown-menu-content` for a menu trigger.',
      component: ZardDemoBreadcrumbDropdownComponent,
      codeData: BREADCRUMB_DEMO_DROPDOWN,
    },
    {
      name: 'collapsed',
      description:
        'Use `z-breadcrumb-ellipsis` to collapse a long trail while keeping the first and last items visible.',
      component: ZardDemoBreadcrumbCollapsedComponent,
      codeData: BREADCRUMB_DEMO_COLLAPSED,
    },
    {
      name: 'link',
      description:
        'Bind `[routerLink]` on `z-breadcrumb-link` to navigate through the Angular `Router` instead of a full page reload.',
      component: ZardDemoBreadcrumbLinkComponent,
      codeData: BREADCRUMB_DEMO_LINK,
    },
  ],
};
