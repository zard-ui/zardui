import { PROGRESS_DEMO_CONTROLLED } from '@generated/components/progress/demo/controlled';
import { PROGRESS_DEMO_PREVIEW } from '@generated/components/progress/demo/preview';
import { PROGRESS_DEMO_WITH_LABEL_AND_VALUE } from '@generated/components/progress/demo/with-label-and-value';
import { PROGRESS_CLI_ADD } from '@generated/installation/cli/add-progress';
import { PROGRESS_MANUAL_CODE } from '@generated/installation/manual/progress';
import { PROGRESS_USAGE_CODE, PROGRESS_USAGE_IMPORT } from '@generated/usage/progress';

import { ZardDemoProgressControlledComponent } from './controlled';
import { ZardDemoProgressPreviewComponent } from './preview';
import { ZardDemoProgressWithLabelAndValueComponent } from './with-label-and-value';
import { PROGRESS_API } from '../doc/api';

export const PROGRESS = {
  componentName: 'progress',
  componentType: 'progress',
  description: 'Displays an indicator showing the completion progress of a task.',
  api: PROGRESS_API,
  about: {
    description:
      "`z-progress` is a single element with a `[value]` input, not shadcn's four-part `Progress` / `ProgressLabel` / `ProgressValue` / `ProgressTrack` / `ProgressIndicator` composition. Project your own label and value markup — such as `z-field-label` — next to `z-progress`, as the `with-label-and-value` example does.",
  },
  installData: {
    cliAdd: PROGRESS_CLI_ADD,
    manualCode: PROGRESS_MANUAL_CODE,
  },
  usage: { importBlock: PROGRESS_USAGE_IMPORT, codeBlock: PROGRESS_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoProgressPreviewComponent,
    codeData: PROGRESS_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'with-label-and-value',
      description: 'Compose `z-field-label` above `z-progress` to render a label and the numeric value together.',
      component: ZardDemoProgressWithLabelAndValueComponent,
      codeData: PROGRESS_DEMO_WITH_LABEL_AND_VALUE,
    },
    {
      name: 'controlled',
      description:
        "Bind `[value]` on `z-progress` to a `z-slider`'s `(zSlideIndexChange)` output for a controlled progress bar.",
      component: ZardDemoProgressControlledComponent,
      codeData: PROGRESS_DEMO_CONTROLLED,
    },
  ],
};
