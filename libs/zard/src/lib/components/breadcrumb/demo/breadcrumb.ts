import { ZardDemoBreadcrumbDefaultComponent } from './default';
import { ZardDemoBreadcrumbEllipsisComponent } from './ellipsis';
import { ZardDemoBreadcrumbSeparatorComponent } from './separator';

export const BREADCRUMB = {
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  description: 'Displays the path to the current resource using a hierarchy of links.',
  examples: [
    {
      name: 'default',
      component: ZardDemoBreadcrumbDefaultComponent,
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
