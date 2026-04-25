import { BUTTON_DEMO_AS_CHILD } from '@generated/components/button/demo/as-child';
import { BUTTON_DEMO_BUTTON_GROUP } from '@generated/components/button/demo/button-group';
import { BUTTON_DEMO_DEFAULT } from '@generated/components/button/demo/default';
import { BUTTON_DEMO_DESTRUCTIVE } from '@generated/components/button/demo/destructive';
import { BUTTON_DEMO_GHOST } from '@generated/components/button/demo/ghost';
import { BUTTON_DEMO_ICON } from '@generated/components/button/demo/icon';
import { BUTTON_DEMO_LINK } from '@generated/components/button/demo/link';
import { BUTTON_DEMO_OUTLINE } from '@generated/components/button/demo/outline';
import { BUTTON_DEMO_PREVIEW } from '@generated/components/button/demo/preview';
import { BUTTON_DEMO_ROUNDED } from '@generated/components/button/demo/rounded';
import { BUTTON_DEMO_SECONDARY } from '@generated/components/button/demo/secondary';
import { BUTTON_DEMO_SIZE } from '@generated/components/button/demo/size';
import { BUTTON_DEMO_SPINNER } from '@generated/components/button/demo/spinner';
import { BUTTON_DEMO_WITH_ICON } from '@generated/components/button/demo/with-icon';
import { BUTTON_CLI_ADD } from '@generated/installation/cli/add-button';
import { BUTTON_MANUAL_CODE } from '@generated/installation/manual/button';
import { BUTTON_USAGE_CODE, BUTTON_USAGE_IMPORT } from '@generated/usage/button';

import { ZardDemoButtonAsChildComponent } from './as-child';
import { ZardDemoButtonButtonGroupComponent } from './button-group';
import { ZardDemoButtonDefaultComponent } from './default';
import { ZardDemoButtonDestructiveComponent } from './destructive';
import { ZardDemoButtonGhostComponent } from './ghost';
import { ZardDemoButtonIconComponent } from './icon';
import { ZardDemoButtonLinkComponent } from './link';
import { ZardDemoButtonOutlineComponent } from './outline';
import { ZardDemoButtonPreviewComponent } from './preview';
import { ZardDemoButtonRoundedComponent } from './rounded';
import { ZardDemoButtonSecondaryComponent } from './secondary';
import { ZardDemoButtonSizeComponent } from './size';
import { ZardDemoButtonSpinnerComponent } from './spinner';
import { ZardDemoButtonWithIconComponent } from './with-icon';
import { BUTTON_API } from '../doc/api';

export const BUTTON = {
  api: BUTTON_API,
  componentName: 'button',
  componentType: 'button',
  description: 'Displays a button or a component that looks like a button.',
  installData: {
    cliAdd: BUTTON_CLI_ADD,
    manualCode: BUTTON_MANUAL_CODE,
  },
  usage: { importBlock: BUTTON_USAGE_IMPORT, codeBlock: BUTTON_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoButtonPreviewComponent,
    codeData: BUTTON_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'size',
      description: 'Use the `zSize` prop to change the size of the button.',
      component: ZardDemoButtonSizeComponent,
      codeData: BUTTON_DEMO_SIZE,
    },
    {
      name: 'default',
      component: ZardDemoButtonDefaultComponent,
      codeData: BUTTON_DEMO_DEFAULT,
    },
    {
      name: 'outline',
      component: ZardDemoButtonOutlineComponent,
      codeData: BUTTON_DEMO_OUTLINE,
    },
    {
      name: 'secondary',
      component: ZardDemoButtonSecondaryComponent,
      codeData: BUTTON_DEMO_SECONDARY,
    },
    {
      name: 'ghost',
      component: ZardDemoButtonGhostComponent,
      codeData: BUTTON_DEMO_GHOST,
    },
    {
      name: 'destructive',
      component: ZardDemoButtonDestructiveComponent,
      codeData: BUTTON_DEMO_DESTRUCTIVE,
    },
    {
      name: 'link',
      component: ZardDemoButtonLinkComponent,
      codeData: BUTTON_DEMO_LINK,
    },
    {
      name: 'icon',
      component: ZardDemoButtonIconComponent,
      codeData: BUTTON_DEMO_ICON,
    },
    {
      name: 'with-icon',
      description: 'Project an `<ng-icon>` before or after the label to render an icon next to the button text.',
      component: ZardDemoButtonWithIconComponent,
      codeData: BUTTON_DEMO_WITH_ICON,
    },
    {
      name: 'rounded',
      description: 'Use the `rounded-full` class to make the button rounded.',
      component: ZardDemoButtonRoundedComponent,
      codeData: BUTTON_DEMO_ROUNDED,
    },
    {
      name: 'spinner',
      description:
        'Use the `[zLoading]` prop to show a loading spinner before the label, or project an `<ng-icon name="lucideLoaderCircle" class="animate-spin" />` manually to control its position.',
      component: ZardDemoButtonSpinnerComponent,
      codeData: BUTTON_DEMO_SPINNER,
    },
    {
      name: 'button-group',
      description:
        'To create a button group, use the `<z-button-group>` component. See the Button Group documentation for more details.',
      component: ZardDemoButtonButtonGroupComponent,
      codeData: BUTTON_DEMO_BUTTON_GROUP,
    },
    {
      name: 'as-child',
      description:
        "Apply the `z-button` attribute selector to a different element (like `<a>`) to give it the button appearance. Here's an example of a link that looks like a button.",
      component: ZardDemoButtonAsChildComponent,
      codeData: BUTTON_DEMO_AS_CHILD,
    },
  ],
};
