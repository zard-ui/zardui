import { LayoutDemoBasicComponent } from './basic';
import { LayoutDemoFullComponent } from './full-layout';
import { LayoutDemoSidebarComponent } from './sidebar';

export const LAYOUT = {
  componentName: 'layout',
  componentType: 'layout',
  fullWidth: true,
  examples: [
    {
      name: 'basic',
      component: LayoutDemoBasicComponent,
    },
    {
      name: 'sidebar',
      component: LayoutDemoSidebarComponent,
      fullScreen: true,
    },
    {
      name: 'full-layout',
      component: LayoutDemoFullComponent,
      fullScreen: true,
    },
  ],
};
