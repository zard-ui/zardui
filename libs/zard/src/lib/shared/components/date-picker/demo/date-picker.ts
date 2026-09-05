import { DATE_PICKER_DEMO_BASIC } from '@generated/components/date-picker/demo/basic';
import { DATE_PICKER_DEMO_DATE_OF_BIRTH } from '@generated/components/date-picker/demo/date-of-birth';
import { DATE_PICKER_DEMO_FORMATS } from '@generated/components/date-picker/demo/formats';
import { DATE_PICKER_DEMO_INPUT } from '@generated/components/date-picker/demo/input';
import { DATE_PICKER_DEMO_PREVIEW } from '@generated/components/date-picker/demo/preview';
import { DATE_PICKER_DEMO_RANGE } from '@generated/components/date-picker/demo/range';
import { DATE_PICKER_DEMO_SIZES } from '@generated/components/date-picker/demo/sizes';
import { DATE_PICKER_DEMO_TIME_PICKER } from '@generated/components/date-picker/demo/time-picker';
import { DATE_PICKER_CLI_ADD } from '@generated/installation/cli/add-date-picker';
import { DATE_PICKER_MANUAL_CODE } from '@generated/installation/manual/date-picker';
import { DATE_PICKER_USAGE_IMPORT, DATE_PICKER_USAGE_CODE } from '@generated/usage/date-picker';

import { ZardDemoDatePickerBasicComponent } from './basic';
import { ZardDemoDatePickerDateOfBirthComponent } from './date-of-birth';
import { ZardDemoDatePickerFormatsComponent } from './formats';
import { ZardDemoDatePickerInputComponent } from './input';
import { ZardDemoDatePickerPreviewComponent } from './preview';
import { ZardDemoDatePickerRangeComponent } from './range';
import { ZardDemoDatePickerSizesComponent } from './sizes';
import { ZardDemoDatePickerTimePickerComponent } from './time-picker';
import { DATE_PICKER_API } from '../doc/api';

export const DATE_PICKER = {
  api: DATE_PICKER_API,
  componentName: 'date-picker',
  componentType: 'date-picker',
  description: 'A button that opens a calendar in a popover to pick one date, several dates, or a date range.',
  installData: {
    cliAdd: DATE_PICKER_CLI_ADD,
    manualCode: DATE_PICKER_MANUAL_CODE,
  },
  usage: { importBlock: DATE_PICKER_USAGE_IMPORT, codeBlock: DATE_PICKER_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoDatePickerPreviewComponent,
    codeData: DATE_PICKER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description:
        'Pair it with a `<div z-field>` label through `zId`, and use `zIcon="none"` to drop the trailing chevron.',
      component: ZardDemoDatePickerBasicComponent,
      codeData: DATE_PICKER_DEMO_BASIC,
    },
    {
      name: 'date-of-birth',
      description: 'Use `zCaptionLayout="dropdown"` with `minDate`/`maxDate` to jump across decades in two clicks.',
      component: ZardDemoDatePickerDateOfBirthComponent,
      codeData: DATE_PICKER_DEMO_DATE_OF_BIRTH,
    },
    {
      name: 'range',
      description:
        'Use `zMode="range"` to pick a start and an end date — the popover only closes once both ends are set.',
      component: ZardDemoDatePickerRangeComponent,
      codeData: DATE_PICKER_DEMO_RANGE,
    },
    {
      name: 'time-picker',
      description: 'Put the picker next to a `type="time"` input to collect a date and a time.',
      component: ZardDemoDatePickerTimePickerComponent,
      codeData: DATE_PICKER_DEMO_TIME_PICKER,
    },
    {
      name: 'input',
      description:
        'Compose `z-input-group`, `z-popover` and `z-calendar` when the date should also be typeable — arrow down opens the calendar.',
      component: ZardDemoDatePickerInputComponent,
      codeData: DATE_PICKER_DEMO_INPUT,
    },
    {
      name: 'sizes',
      description: '`zSize` follows the button scale, so a picker lines up with the inputs around it.',
      component: ZardDemoDatePickerSizesComponent,
      codeData: DATE_PICKER_DEMO_SIZES,
    },
    {
      name: 'formats',
      description: '`zFormat` takes any Angular `DatePipe` pattern.',
      component: ZardDemoDatePickerFormatsComponent,
      codeData: DATE_PICKER_DEMO_FORMATS,
    },
  ],
};
