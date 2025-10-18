import { ZardDemoTooltipPositionComponent } from './position';
import { ZardDemoTooltipEventsComponent } from './events';
import { ZardDemoTooltipHoverComponent } from './hover';
import { ZardDemoTooltipClickComponent } from './click';

export const TOOLTIP = {
  componentName: 'tooltip',
  componentType: 'tooltip',
  description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
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
