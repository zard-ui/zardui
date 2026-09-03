import { PAGINATION_DEMO_ICONS_ONLY } from '@generated/components/pagination/demo/icons-only';
import { PAGINATION_DEMO_PREVIEW } from '@generated/components/pagination/demo/preview';
import { PAGINATION_DEMO_ROUTING } from '@generated/components/pagination/demo/routing';
import { PAGINATION_DEMO_SIMPLE } from '@generated/components/pagination/demo/simple';
import { PAGINATION_CLI_ADD } from '@generated/installation/cli/add-pagination';
import { PAGINATION_MANUAL_CODE } from '@generated/installation/manual/pagination';
import { PAGINATION_USAGE_IMPORT, PAGINATION_USAGE_CODE } from '@generated/usage/pagination';

import { ZardDemoPaginationIconsOnlyComponent } from '@/shared/components/pagination/demo/icons-only';

import { ZardDemoPaginationPreviewComponent } from './preview';
import { ZardDemoPaginationRoutingComponent } from './routing';
import { ZardDemoPaginationSimpleComponent } from './simple';
import { PAGINATION_API } from '../doc/api';

export const PAGINATION = {
  componentName: 'pagination',
  componentType: 'pagination',
  description: 'Pagination with page navigation, next and previous links.',
  about: {
    description:
      'Give `z-pagination` a `[zTotal]` and `[(zPageIndex)]` and it renders the full previous/numbers/next nav itself, driving page changes internally. Pass a `[zContent]` template instead to take full manual control of the composition — `ul[z-pagination-content]` > `li[z-pagination-item]` wrapping `z-pagination-button` (or `a`/`button[z-pagination-button]`), `z-pagination-previous`, `z-pagination-next` and `z-pagination-ellipsis` — which is also how an app wires real `routerLink`/`href` navigation onto the page links, as the `routing` example does.',
  },
  api: PAGINATION_API,
  installData: {
    cliAdd: PAGINATION_CLI_ADD,
    manualCode: PAGINATION_MANUAL_CODE,
  },
  usage: { importBlock: PAGINATION_USAGE_IMPORT, codeBlock: PAGINATION_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoPaginationPreviewComponent,
    codeData: PAGINATION_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'simple',
      description: 'A simple pagination with only page numbers.',
      component: ZardDemoPaginationSimpleComponent,
      codeData: PAGINATION_DEMO_SIMPLE,
    },
    {
      name: 'icons-only',
      description:
        'Use just the previous and next buttons without page numbers. This is useful for data tables with a rows per page selector.',
      component: ZardDemoPaginationIconsOnlyComponent,
      codeData: PAGINATION_DEMO_ICONS_ONLY,
    },
    {
      name: 'routing',
      description:
        'Wire `a[z-pagination-button]` to Angular `RouterLink` with `[queryParams]` and `queryParamsHandling="merge"` so page links drive real router navigation — the URL updates and the page is bookmarkable, with no full reload.',
      component: ZardDemoPaginationRoutingComponent,
      codeData: PAGINATION_DEMO_ROUTING,
    },
  ],
};
