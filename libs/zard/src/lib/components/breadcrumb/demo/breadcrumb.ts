import { ZardDemoBreadcrumbComponent } from './default';
import { ZardDemoBreadcrumbEllipsisComponent } from './ellipsis';
import { ZardDemoBreadcrumbSeparatorComponent } from './separator';

export const BREADCRUMB = {
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  examples: [
    {
      name: 'default',
      component: ZardDemoBreadcrumbComponent,
    },
    {
      name: 'separator',
      component: ZardDemoBreadcrumbSeparatorComponent,
    },
    {
      name: 'ellipsis',
      component: ZardDemoBreadcrumbEllipsisComponent,
    },
  ],
};
