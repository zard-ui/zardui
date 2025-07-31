```angular-ts showLineNumbers
import { ZardDemoTooltipClickComponent } from './click';
import { ZardDemoTooltipEventsComponent } from './events';
import { ZardDemoTooltipHoverComponent } from './hover';
import { ZardDemoTooltipPositionComponent } from './position';

export const TOOLTIP = {
  componentName: 'tooltip',
  componentType: 'tooltip',
  examples: [
    {
      name: 'hover',
      component: ZardDemoTooltipHoverComponent,
    },
    {
      name: 'click',
      component: ZardDemoTooltipClickComponent,
    },
    {
      name: 'position',
      component: ZardDemoTooltipPositionComponent,
    },
    {
      name: 'events',
      component: ZardDemoTooltipEventsComponent,
    },
  ],
};

```