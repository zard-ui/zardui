import { CALENDAR_DEMO_BASIC } from '@generated/components/calendar/demo/basic';
import { CALENDAR_DEMO_CAPTION } from '@generated/components/calendar/demo/caption';
import { CALENDAR_DEMO_CUSTOM_CELL_SIZE } from '@generated/components/calendar/demo/custom-cell-size';
import { CALENDAR_DEMO_EXPAND_YEAR_SELECTION_RANGE } from '@generated/components/calendar/demo/expand-year-selection-range';
import { CALENDAR_DEMO_MULTIPLE } from '@generated/components/calendar/demo/multiple';
import { CALENDAR_DEMO_PRESETS } from '@generated/components/calendar/demo/presets';
import { CALENDAR_DEMO_PREVIEW } from '@generated/components/calendar/demo/preview';
import { CALENDAR_DEMO_RANGE } from '@generated/components/calendar/demo/range';
import { CALENDAR_DEMO_WITH_CONSTRAINTS } from '@generated/components/calendar/demo/with-constraints';
import { CALENDAR_DEMO_WITH_TIME } from '@generated/components/calendar/demo/with-time';
import {
  CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_FIXED,
  CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_SPACING,
} from '@generated/components/calendar/snippets';
import { CALENDAR_CLI_ADD } from '@generated/installation/cli/add-calendar';
import { CALENDAR_MANUAL_CODE } from '@generated/installation/manual/calendar';
import { CALENDAR_USAGE_IMPORT, CALENDAR_USAGE_CODE } from '@generated/usage/calendar';

import { ZardDemoCalendarBasicComponent } from './basic';
import { ZardDemoCalendarCaptionComponent } from './caption';
import { ZardDemoCalendarCustomCellSizeComponent } from './custom-cell-size';
import { ZardDemoCalendarExpandYearSelectionRangeComponent } from './expand-year-selection-range';
import { ZardDemoCalendarMultipleComponent } from './multiple';
import { ZardDemoCalendarPresetsComponent } from './presets';
import { ZardDemoCalendarPreviewComponent } from './preview';
import { ZardDemoCalendarRangeComponent } from './range';
import { ZardDemoCalendarWithConstraintsComponent } from './with-constraints';
import { ZardDemoCalendarWithTimeComponent } from './with-time';
import { CALENDAR_API } from '../doc/api';

export const CALENDAR = {
  api: CALENDAR_API,
  componentName: 'calendar',
  componentType: 'calendar',
  description: 'A calendar component that allows users to select a date or a range of dates.',
  installData: {
    cliAdd: CALENDAR_CLI_ADD,
    manualCode: CALENDAR_MANUAL_CODE,
  },
  usage: { importBlock: CALENDAR_USAGE_IMPORT, codeBlock: CALENDAR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCalendarPreviewComponent,
    codeData: CALENDAR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'The calendar renders without a border by default — add `class="rounded-lg border"` to frame it.',
      component: ZardDemoCalendarBasicComponent,
      codeData: CALENDAR_DEMO_BASIC,
    },
    {
      name: 'range',
      description: 'Use `zMode="range"` to let users select a start and an end date.',
      component: ZardDemoCalendarRangeComponent,
      codeData: CALENDAR_DEMO_RANGE,
    },
    {
      name: 'multiple',
      description: 'Use `zMode="multiple"` to select any number of individual dates.',
      component: ZardDemoCalendarMultipleComponent,
      codeData: CALENDAR_DEMO_MULTIPLE,
    },
    {
      name: 'caption',
      description: 'Use `zCaptionLayout="dropdown"` to render month and year selects in the caption.',
      component: ZardDemoCalendarCaptionComponent,
      codeData: CALENDAR_DEMO_CAPTION,
    },
    {
      name: 'presets',
      description: 'Compose the calendar with a `<z-card />` footer to offer quick date presets.',
      component: ZardDemoCalendarPresetsComponent,
      codeData: CALENDAR_DEMO_PRESETS,
    },
    {
      name: 'with-time',
      description: 'Pair the calendar with time inputs to build a date and time picker.',
      component: ZardDemoCalendarWithTimeComponent,
      codeData: CALENDAR_DEMO_WITH_TIME,
    },
    {
      name: 'custom-cell-size',
      description: 'Override the `--cell-size` CSS variable to resize the whole calendar.',
      component: ZardDemoCalendarCustomCellSizeComponent,
      codeData: CALENDAR_DEMO_CUSTOM_CELL_SIZE,
      codeAfter: [
        { codeData: CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_SPACING },
        { codeData: CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_FIXED },
      ],
    },
    {
      name: 'with-constraints',
      description: 'Use `minDate` and `maxDate` to limit the selectable range, or `disabled` to turn it off.',
      component: ZardDemoCalendarWithConstraintsComponent,
      codeData: CALENDAR_DEMO_WITH_CONSTRAINTS,
    },
    {
      name: 'expand-year-selection-range',
      description: '`minDate` and `maxDate` also expand the year dropdown — useful for a date of birth picker.',
      component: ZardDemoCalendarExpandYearSelectionRangeComponent,
      codeData: CALENDAR_DEMO_EXPAND_YEAR_SELECTION_RANGE,
    },
  ],
};
