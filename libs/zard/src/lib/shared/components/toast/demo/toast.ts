import { TOAST_DEMO_SHOW } from '@generated/components/toast/demo/show';
import { SONNER_CLI_ADD } from '@generated/installation/cli/add-sonner';
import { SONNER_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-sonner';
import { SONNER_MANUAL_CODE } from '@generated/installation/manual/sonner';
import { SONNER_REGISTER } from '@generated/installation/register/register-sonner';
import { SONNER_USAGE_CODE, SONNER_USAGE_IMPORT } from '@generated/usage/sonner';

import { ZardDemoToastPreviewComponent } from './preview';
import { ZardDemoToastShowComponent } from './show';
import { SONNER_API } from '../../sonner/doc/api';

/**
 * Toast is the components-list face of Sonner, as in shadcn/ui: a deprecation notice that points at the
 * `sonner` component. It has no files of its own, so installation, usage and API are Sonner's.
 */
export const TOAST = {
  componentName: 'toast',
  componentType: 'toast',
  description: 'A succinct message that is displayed temporarily.',
  notice: 'The toast component has been deprecated. Use the sonner component instead.',
  links: [{ label: 'Sonner', href: '/docs/components/sonner' }],
  api: SONNER_API,
  installData: {
    cliAdd: SONNER_CLI_ADD,
    manualCode: SONNER_MANUAL_CODE,
    manualDeps: SONNER_MANUAL_INSTALL_DEPS,
    register: SONNER_REGISTER,
  },
  usage: { importBlock: SONNER_USAGE_IMPORT, codeBlock: SONNER_USAGE_CODE },
  preview: {
    name: 'preview',
    column: false,
    onlyDemo: true,
    component: ZardDemoToastPreviewComponent,
  },
  examples: [
    {
      name: 'show',
      description: 'Inject `ZardSonnerService` and call `show` to dispatch a toast.',
      component: ZardDemoToastShowComponent,
      codeData: TOAST_DEMO_SHOW,
    },
  ],
};
