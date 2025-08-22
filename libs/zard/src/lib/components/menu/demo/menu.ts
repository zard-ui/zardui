import { ZardDemoMenuDefaultComponent } from './default';
import { ZardDemoMenuHorizontalComponent } from './horizontal';
import { ZardDemoMenuInlineComponent } from './inline';

export const MENU = {
  componentName: 'menu',
  componentType: 'Menu',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoMenuDefaultComponent,
    },
    {
      name: 'horizontal',
      component: ZardDemoMenuHorizontalComponent,
    },
    {
      name: 'inline',
      component: ZardDemoMenuInlineComponent,
    },
  ],
};
