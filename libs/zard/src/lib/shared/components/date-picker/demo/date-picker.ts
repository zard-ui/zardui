import { DATE_PICKER_DEMO_DEFAULT } from '@generated/components/date-picker/demo/default';
import { DATE_PICKER_DEMO_FORMATS } from '@generated/components/date-picker/demo/formats';
import { DATE_PICKER_DEMO_SIZES } from '@generated/components/date-picker/demo/sizes';
import { DATE_PICKER_CLI_ADD } from '@generated/installation/cli/add-date-picker';
import { DATE_PICKER_MANUAL_CODE } from '@generated/installation/manual/date-picker';
import { DATE_PICKER_USAGE_IMPORT, DATE_PICKER_USAGE_CODE } from '@generated/usage/date-picker';

import { ZardDemoDatePickerDefaultComponent } from './default';
import { ZardDatePickerFormatsComponent } from './formats';
import { ZardDemoDatePickerSizesComponent } from './sizes';
import { DATE_PICKER_API } from '../doc/api';

export const DATE_PICKER = {
  api: DATE_PICKER_API,
  componentName: 'date-picker',
  componentType: 'date-picker',
  description: 'A date picker component with range and presets.',
  installData: {
    cliAdd: DATE_PICKER_CLI_ADD,
    manualCode: DATE_PICKER_MANUAL_CODE,
  },
  usage: { importBlock: DATE_PICKER_USAGE_IMPORT, codeBlock: DATE_PICKER_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoDatePickerDefaultComponent,
      codeData: DATE_PICKER_DEMO_DEFAULT,
    },
    {
      name: 'sizes',
      component: ZardDemoDatePickerSizesComponent,
      codeData: DATE_PICKER_DEMO_SIZES,
    },
    {
      name: 'formats',
      component: ZardDatePickerFormatsComponent,
      codeData: DATE_PICKER_DEMO_FORMATS,
    },
  ],
};
