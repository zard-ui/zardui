import { ZardDemoPopoverDefaultComponent } from './default';
import { ZardDemoPopoverHoverComponent } from './hover';
import { ZardDemoPopoverInteractiveComponent } from './interactive';
import { ZardDemoPopoverPlacementComponent } from './placement';

export const POPOVER = {
  componentName: 'popover',
  componentType: 'popover',
  examples: [
    {
      name: 'default',
      component: ZardDemoPopoverDefaultComponent,
    },
    {
      name: 'hover',
      component: ZardDemoPopoverHoverComponent,
    },
    {
      name: 'placement',
      component: ZardDemoPopoverPlacementComponent,
    },
    {
      name: 'interactive',
      component: ZardDemoPopoverInteractiveComponent,
    },
  ],
};
