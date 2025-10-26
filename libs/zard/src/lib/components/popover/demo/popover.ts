import { ZardDemoPopoverInteractiveComponent } from './interactive';
import { ZardDemoPopoverPlacementComponent } from './placement';
import { ZardDemoPopoverDefaultComponent } from './default';
import { ZardDemoPopoverHoverComponent } from './hover';

export const POPOVER = {
  componentName: 'popover',
  componentType: 'popover',
  description: 'Displays rich content in a portal, triggered by a button.',
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
