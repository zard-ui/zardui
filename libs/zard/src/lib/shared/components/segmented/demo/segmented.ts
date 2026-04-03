import { SEGMENTED_DEMO_DEFAULT } from '@generated/components/segmented/demo/default';
import { SEGMENTED_DEMO_DISABLED } from '@generated/components/segmented/demo/disabled';
import { SEGMENTED_DEMO_SIZES } from '@generated/components/segmented/demo/sizes';
import { SEGMENTED_CLI_ADD } from '@generated/installation/cli/add-segmented';
import { SEGMENTED_MANUAL_CODE } from '@generated/installation/manual/segmented';

import { ZardDemoSegmentedDefaultComponent } from './default';
import { ZardDemoSegmentedDisabledComponent } from './disabled';
import { ZardDemoSegmentedSizesComponent } from './sizes';
import { SEGMENTED_API } from '../doc/api';

export const SEGMENTED = {
  componentName: 'segmented',
  componentType: 'segmented',
  api: SEGMENTED_API,
  description:
    'A set of two or more segments, each of which functions as a mutually exclusive button. Based on shadcn/ui Tabs component pattern, providing a clean way to create toggle controls with single selection.',
  installData: {
    cliAdd: SEGMENTED_CLI_ADD,
    manualCode: SEGMENTED_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoSegmentedDefaultComponent,
      codeData: SEGMENTED_DEMO_DEFAULT,
    },
    {
      name: 'sizes',
      component: ZardDemoSegmentedSizesComponent,
      codeData: SEGMENTED_DEMO_SIZES,
    },
    {
      name: 'disabled',
      component: ZardDemoSegmentedDisabledComponent,
      codeData: SEGMENTED_DEMO_DISABLED,
    },
  ],
};
