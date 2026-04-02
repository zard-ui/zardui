import { CALENDAR_DEMO_DEFAULT } from '@generated/components/calendar/demo/default';
import { CALENDAR_DEMO_EXPAND_YEAR_SELECTION_RANGE } from '@generated/components/calendar/demo/expand-year-selection-range';
import { CALENDAR_DEMO_MULTIPLE } from '@generated/components/calendar/demo/multiple';
import { CALENDAR_DEMO_RANGE } from '@generated/components/calendar/demo/range';
import { CALENDAR_DEMO_WITH_CONSTRAINTS } from '@generated/components/calendar/demo/with-constraints';
import { CALENDAR_CLI_ADD } from '@generated/installation/cli/add-calendar';
import { CALENDAR_MANUAL_CODE } from '@generated/installation/manual/calendar';

import { ZardDemoCalendarDefaultComponent } from './default';
import { ZardDemoCalendarExpandYearSelectionRangeComponent } from './expand-year-selection-range';
import { ZardDemoCalendarMultipleComponent } from './multiple';
import { ZardDemoCalendarRangeComponent } from './range';
import { ZardDemoCalendarWithConstraintsComponent } from './with-constraints';

export const CALENDAR = {
  componentName: 'calendar',
  componentType: 'calendar',
  description:
    'A flexible and accessible calendar component for selecting dates. Built with modern Angular patterns and full keyboard navigation support.',
  fullWidth: true,
  installData: {
    cliAdd: CALENDAR_CLI_ADD,
    manualCode: CALENDAR_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoCalendarDefaultComponent,
      codeData: CALENDAR_DEMO_DEFAULT,
    },
    {
      name: 'multiple',
      component: ZardDemoCalendarMultipleComponent,
      codeData: CALENDAR_DEMO_MULTIPLE,
    },
    {
      name: 'range',
      component: ZardDemoCalendarRangeComponent,
      codeData: CALENDAR_DEMO_RANGE,
    },
    {
      name: 'with-constraints',
      component: ZardDemoCalendarWithConstraintsComponent,
      codeData: CALENDAR_DEMO_WITH_CONSTRAINTS,
    },
    {
      name: 'expand-year-selection-range',
      component: ZardDemoCalendarExpandYearSelectionRangeComponent,
      codeData: CALENDAR_DEMO_EXPAND_YEAR_SELECTION_RANGE,
    },
  ],
};
