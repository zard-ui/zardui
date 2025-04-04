import { ZardDemoBreadcrumbCustomSeparatorComponent } from './custom-separator';
import { ZardDemoBreadcrumbComponent } from './default';
import { ZardDemoBreadcrumbRouterLinkComponent } from './router-link';

export const BREADCRUMB = {
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  examples: [
    {
      name: 'default',
      component: ZardDemoBreadcrumbComponent,
    },
    {
      name: 'router-link',
      component: ZardDemoBreadcrumbRouterLinkComponent,
    },
    {
      name: 'custom-separator',
      component: ZardDemoBreadcrumbCustomSeparatorComponent,
    },
  ],
};
