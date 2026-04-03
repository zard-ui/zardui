import { RESIZABLE_DEMO_DEFAULT } from '@generated/components/resizable/demo/default';
import { RESIZABLE_DEMO_VERTICAL } from '@generated/components/resizable/demo/vertical';
import { RESIZABLE_DEMO_WITH_MIN_MAX } from '@generated/components/resizable/demo/with-min-max';
import { RESIZABLE_CLI_ADD } from '@generated/installation/cli/add-resizable';
import { RESIZABLE_MANUAL_CODE } from '@generated/installation/manual/resizable';

import { ZardDemoResizableDefaultComponent } from './default';
import { ZardDemoResizableVerticalComponent } from './vertical';
import { ZardDemoResizableWithMinMaxComponent } from './with-min-max';
import { RESIZABLE_API } from '../doc/api';

export const RESIZABLE = {
  componentName: 'resizable',
  componentType: 'resizable',
  description: 'A resizable layout component that allows users to resize panels by dragging dividers between them.',
  fullWidth: true,
  api: RESIZABLE_API,
  installData: {
    cliAdd: RESIZABLE_CLI_ADD,
    manualCode: RESIZABLE_MANUAL_CODE,
  },
  examples: [
    {
      name: 'default',
      component: ZardDemoResizableDefaultComponent,
      codeData: RESIZABLE_DEMO_DEFAULT,
    },
    {
      name: 'vertical',
      component: ZardDemoResizableVerticalComponent,
      codeData: RESIZABLE_DEMO_VERTICAL,
    },
    {
      name: 'with-min-max',
      component: ZardDemoResizableWithMinMaxComponent,
      codeData: RESIZABLE_DEMO_WITH_MIN_MAX,
    },
  ],
};
