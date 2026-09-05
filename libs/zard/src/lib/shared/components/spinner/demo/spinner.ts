import { SPINNER_DEMO_BADGE } from '@generated/components/spinner/demo/badge';
import { SPINNER_DEMO_BUTTON } from '@generated/components/spinner/demo/button';
import { SPINNER_DEMO_CUSTOM_ICON } from '@generated/components/spinner/demo/custom-icon';
import { SPINNER_DEMO_EMPTY } from '@generated/components/spinner/demo/empty';
import { SPINNER_DEMO_INPUT_GROUP } from '@generated/components/spinner/demo/input-group';
import { SPINNER_DEMO_PREVIEW } from '@generated/components/spinner/demo/preview';
import { SPINNER_DEMO_SIZE } from '@generated/components/spinner/demo/size';
import { SPINNER_CLI_ADD } from '@generated/installation/cli/add-spinner';
import { SPINNER_MANUAL_CODE } from '@generated/installation/manual/spinner';
import { SPINNER_USAGE_CODE, SPINNER_USAGE_IMPORT } from '@generated/usage/spinner';

import { ZardDemoSpinnerBadgeComponent } from './badge';
import { ZardDemoSpinnerButtonComponent } from './button';
import { ZardDemoSpinnerCustomIconComponent } from './custom-icon';
import { ZardDemoSpinnerEmptyComponent } from './empty';
import { ZardDemoSpinnerInputGroupComponent } from './input-group';
import { ZardDemoSpinnerPreviewComponent } from './preview';
import { ZardDemoSpinnerSizeComponent } from './size';
import { SPINNER_API } from '../doc/api';

export const SPINNER = {
  componentName: 'spinner',
  componentType: 'spinner',
  description:
    'A visual component that displays a loading animation to indicate that an action or process is in progress.',
  api: SPINNER_API,
  installData: {
    cliAdd: SPINNER_CLI_ADD,
    manualCode: SPINNER_MANUAL_CODE,
  },
  usage: { importBlock: SPINNER_USAGE_IMPORT, codeBlock: SPINNER_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSpinnerPreviewComponent,
    codeData: SPINNER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'custom-icon',
      description:
        "Pass a custom `ng-template` to `[zIcon]` to swap the default loader icon. The template receives the spinner's merged classes via its implicit context, so the replacement icon stays in sync with sizing and animation.",
      component: ZardDemoSpinnerCustomIconComponent,
      codeData: SPINNER_DEMO_CUSTOM_ICON,
    },
    {
      name: 'size',
      description:
        "Control the spinner's dimensions with Tailwind size utilities on `class` (`size-3`, `size-4`, `size-6`, `size-8`) — `z-spinner` has no dedicated `zSize` input.",
      component: ZardDemoSpinnerSizeComponent,
      codeData: SPINNER_DEMO_SIZE,
    },
    {
      name: 'button',
      description:
        'Project `<z-spinner data-icon="inline-start">` before the label inside `z-button` to show a busy state, paired with `[zDisabled]` to prevent interaction while loading. `z-button` also exposes its own `[zLoading]` input that renders a spinner automatically — see the Button docs.',
      component: ZardDemoSpinnerButtonComponent,
      codeData: SPINNER_DEMO_BUTTON,
    },
    {
      name: 'badge',
      description:
        'Project `<z-spinner data-icon="inline-start">` inside `z-badge` to show a busy state next to the label.',
      component: ZardDemoSpinnerBadgeComponent,
      codeData: SPINNER_DEMO_BADGE,
    },
    {
      name: 'input-group',
      description:
        'Place `<z-spinner>` inside `z-input-group-addon` to show a busy state next to an input or textarea; pair it with `z-input-group-text` for a status label, or with a trailing `z-input-group-button` for an action.',
      component: ZardDemoSpinnerInputGroupComponent,
      codeData: SPINNER_DEMO_INPUT_GROUP,
    },
    {
      name: 'empty',
      description:
        "Project `<z-spinner>` into `z-empty`'s `[zImage]` media slot to show a busy state while content loads, alongside `zTitle`, `zDescription` and a cancel action passed to `[zActions]`.",
      component: ZardDemoSpinnerEmptyComponent,
      codeData: SPINNER_DEMO_EMPTY,
    },
  ],
};
