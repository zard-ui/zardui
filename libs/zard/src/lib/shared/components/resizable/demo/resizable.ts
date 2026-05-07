import { RESIZABLE_DEMO_PREVIEW } from '@generated/components/resizable/demo/preview';
import { RESIZABLE_DEMO_VERTICAL } from '@generated/components/resizable/demo/vertical';
import { RESIZABLE_DEMO_WITH_HANDLE } from '@generated/components/resizable/demo/with-handle';
import { RESIZABLE_CLI_ADD } from '@generated/installation/cli/add-resizable';
import { RESIZABLE_MANUAL_CODE } from '@generated/installation/manual/resizable';
import { RESIZABLE_USAGE_CODE, RESIZABLE_USAGE_IMPORT } from '@generated/usage/resizable';

import { ZardDemoResizableVerticalComponent } from '@/shared/components/resizable/demo/vertical';
import { ZardDemoResizableWithHandleComponent } from '@/shared/components/resizable/demo/with-handle';

import { ZardDemoResizablePreviewComponent } from './preview';
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
  usage: { importBlock: RESIZABLE_USAGE_IMPORT, codeBlock: RESIZABLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoResizablePreviewComponent,
    codeData: RESIZABLE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'vertical',
      description: 'Use zLayout="vertical" for vertical resizing.',
      component: ZardDemoResizableVerticalComponent,
      codeData: RESIZABLE_DEMO_VERTICAL,
    },
    {
      name: 'with-handle',
      description: 'Use the "zWithHandle" input on "z-resizable-handle" to show a visible handle.',
      component: ZardDemoResizableWithHandleComponent,
      codeData: RESIZABLE_DEMO_WITH_HANDLE,
    },
  ],
};
