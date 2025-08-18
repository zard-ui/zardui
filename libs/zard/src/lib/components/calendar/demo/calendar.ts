import { ZardDemoCalendarDefaultComponent } from './default';
import { ZardDemoCalendarSizesComponent } from './sizes';
import { ZardDemoCalendarWithConstraintsComponent } from './with-constraints';

export const CALENDAR = {
  componentName: 'calendar',
  componentType: 'calendar',
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
