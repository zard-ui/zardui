import { LayoutDemoFullComponent } from './full-layout';
import { LayoutDemoSidebarComponent } from './sidebar';
import { LayoutDemoBasicComponent } from './basic';

export const LAYOUT = {
  componentName: 'layout',
  componentType: 'layout',
  description: 'A set of layout components for creating common page structures with header, footer, sidebar, and content areas.',
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
