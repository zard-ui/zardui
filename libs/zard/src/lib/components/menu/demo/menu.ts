import { ZardDemoMenuDefaultComponent } from './default';
import { ZardDemoMenuHorizontalComponent } from './horizontal';
import { ZardDemoMenuInlineComponent } from './inline';
import { ZardDemoMenuVerticalComponent } from './vertical';

export const MENU = {
  componentName: 'menu',
  componentType: 'Menu',
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
      name: 'vertical',
      component: ZardDemoMenuVerticalComponent,
    },
    {
      name: 'inline',
      component: ZardDemoMenuInlineComponent,
    },
  ],
};
