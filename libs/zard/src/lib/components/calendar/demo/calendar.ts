import { ZardDemoCalendarDefaultComponent } from './default';
import { ZardDemoCalendarMultipleComponent } from './multiple';
import { ZardDemoCalendarRangeComponent } from './range';
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
      name: 'multiple',
      component: ZardDemoCalendarMultipleComponent,
    },
    {
      name: 'range',
      component: ZardDemoCalendarRangeComponent,
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
