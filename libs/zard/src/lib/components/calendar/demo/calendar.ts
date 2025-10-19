import { ZardDemoCalendarWithConstraintsComponent } from './with-constraints';
import { ZardDemoCalendarDefaultComponent } from './default';
import { ZardDemoCalendarSizesComponent } from './sizes';

export const CALENDAR = {
  componentName: 'calendar',
  componentType: 'calendar',
  description: 'A flexible and accessible calendar component for selecting dates. Built with modern Angular patterns and full keyboard navigation support.',
  fullWidth: true,
  examples: [
    {
      name: 'default',
      component: ZardDemoCalendarDefaultComponent,
    },
    {
      name: 'sizes',
      component: ZardDemoCalendarSizesComponent,
    },
    {
      name: 'with-constraints',
      component: ZardDemoCalendarWithConstraintsComponent,
    },
  ],
};
