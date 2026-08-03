import { PROGRESS_DEMO_PREVIEW } from '@generated/components/progress/demo/preview';
import { SKELETON_DEMO_DEFAULT } from '@generated/components/skeleton/demo/default';
import { SPINNER_DEMO_CUSTOMIZATION } from '@generated/components/spinner/demo/customization';
import { PROGRESS_CLI_ADD } from '@generated/installation/cli/add-progress';
import { SKELETON_CLI_ADD } from '@generated/installation/cli/add-skeleton';
import { SPINNER_CLI_ADD } from '@generated/installation/cli/add-spinner';

import { ZardDemoProgressPreviewComponent } from '@zard/components/progress/demo/preview';
import { ZardDemoSkeletonDefaultComponent } from '@zard/components/skeleton/demo/default';
import { ZardDemoSpinnerCustomizationComponent } from '@zard/components/spinner/demo/customization';

import { type ChangelogExample } from '../changelog-entry.interface';

export const SEPTEMBER_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description: 'Visual progress indicator showing the completion progress of a task.',
    component: ZardDemoProgressPreviewComponent,
    componentName: 'progress',
    codeData: PROGRESS_DEMO_PREVIEW,
    cliAdd: PROGRESS_CLI_ADD,
  },
  {
    name: 'default',
    description:
      'Loading placeholder component for better perceived performance during content loading with pulse animation.',
    component: ZardDemoSkeletonDefaultComponent,
    componentName: 'skeleton',
    codeData: SKELETON_DEMO_DEFAULT,
    cliAdd: SKELETON_CLI_ADD,
  },
  {
    name: 'customization',
    description:
      'Animated loading spinner customizable via the [zIcon] template input for swapping the underlying icon.',
    component: ZardDemoSpinnerCustomizationComponent,
    componentName: 'spinner',
    codeData: SPINNER_DEMO_CUSTOMIZATION,
    cliAdd: SPINNER_CLI_ADD,
  },
];
