import { ZardDemoBreadcrumbCustomSeparatorContentProjectionComponent } from './separator-content-projection';
import { ZardDemoBreadcrumbCustomSeparatorTemplateRefComponent } from './separator-template-ref';
import { ZardDemoBreadcrumbCustomSeparatorStringComponent } from './separator-string';
import { ZardDemoBreadcrumbCollapsedComponent } from './ellipsis-collapsed-state';
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
      name: 'separator-string',
      component: ZardDemoBreadcrumbCustomSeparatorStringComponent,
    },
    {
      name: 'separator-template-ref',
      component: ZardDemoBreadcrumbCustomSeparatorTemplateRefComponent,
    },
    {
      name: 'separator-content-projection',
      component: ZardDemoBreadcrumbCustomSeparatorContentProjectionComponent,
    },
    {
      name: 'ellipsis-collapsed-state',
      component: ZardDemoBreadcrumbCollapsedComponent,
    },
  ],
};
