```angular-ts showLineNumbers
import { ZardDemoBreadcrumbCollapsedComponent } from './ellipsis-collapsed-state';
import { ZardDemoBreadcrumbCustomSeparatorComponent } from './custom-separator';
import { ZardDemoBreadcrumbWithAnIconComponent } from './with-an-icon';
import { ZardDemoBreadcrumbRouterLinkComponent } from './router-link';
import { ZardDemoBreadcrumbComponent } from './default';

export const BREADCRUMB = {
  componentName: 'breadcrumb',
  componentType: 'breadcrumb',
  examples: [
    {
      name: 'default',
      component: ZardDemoBreadcrumbComponent,
    },
    {
      name: 'with-an-icon',
      component: ZardDemoBreadcrumbWithAnIconComponent,
    },
    {
      name: 'router-link',
      component: ZardDemoBreadcrumbRouterLinkComponent,
    },
    {
      name: 'custom-separator',
      component: ZardDemoBreadcrumbCustomSeparatorComponent,
    },
    {
      name: 'ellipsis-collapsed-state',
      component: ZardDemoBreadcrumbCollapsedComponent,
    },
  ],
};

```