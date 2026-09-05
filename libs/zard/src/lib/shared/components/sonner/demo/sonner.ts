import { SONNER_DEMO_ACTION } from '@generated/components/sonner/demo/action';
import { SONNER_DEMO_DESCRIPTION } from '@generated/components/sonner/demo/description';
import { SONNER_DEMO_POSITION } from '@generated/components/sonner/demo/position';
import { SONNER_DEMO_PREVIEW } from '@generated/components/sonner/demo/preview';
import { SONNER_DEMO_PROMISE } from '@generated/components/sonner/demo/promise';
import { SONNER_DEMO_TYPES } from '@generated/components/sonner/demo/types';
import { SONNER_DEMO_WITH_DIALOG } from '@generated/components/sonner/demo/with-dialog';
import { SONNER_CLI_ADD } from '@generated/installation/cli/add-sonner';
import { SONNER_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-sonner';
import { SONNER_MANUAL_CODE } from '@generated/installation/manual/sonner';
import { SONNER_REGISTER } from '@generated/installation/register/register-sonner';
import { SONNER_USAGE_CODE, SONNER_USAGE_IMPORT } from '@generated/usage/sonner';

import { ZardDemoSonnerActionComponent } from './action';
import { ZardDemoSonnerDescriptionComponent } from './description';
import { ZardDemoSonnerPositionComponent } from './position';
import { ZardDemoSonnerPreviewComponent } from './preview';
import { ZardDemoSonnerPromiseComponent } from './promise';
import { ZardDemoSonnerTypesComponent } from './types';
import { ZardDemoSonnerWithDialogComponent } from './with-dialog';
import { SONNER_API } from '../doc/api';

export const SONNER = {
  componentName: 'sonner',
  componentType: 'sonner',
  api: SONNER_API,
  description: 'An opinionated toast component for Angular.',
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
    component: ZardDemoSonnerPreviewComponent,
    codeData: SONNER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'types',
      description: 'Use `sonner.success`, `.info`, `.warning` or `.error` to dispatch a styled toast.',
      component: ZardDemoSonnerTypesComponent,
      codeData: SONNER_DEMO_TYPES,
    },
    {
      name: 'action',
      description: 'Pass an `action` option with a `label` and `onClick` to render a button inside the toast.',
      component: ZardDemoSonnerActionComponent,
      codeData: SONNER_DEMO_ACTION,
    },
    {
      name: 'promise',
      description: 'Use `sonner.promise` to track a promise through loading, success and error.',
      component: ZardDemoSonnerPromiseComponent,
      codeData: SONNER_DEMO_PROMISE,
    },
    {
      name: 'description',
      description: 'Pass a `description` option to render supporting text underneath the message.',
      component: ZardDemoSonnerDescriptionComponent,
      codeData: SONNER_DEMO_DESCRIPTION,
    },
    {
      name: 'position',
      description: 'Use the `position` option to change the position of a single toast.',
      component: ZardDemoSonnerPositionComponent,
      codeData: SONNER_DEMO_POSITION,
    },
    {
      name: 'with-dialog',
      description: 'Toasts are rendered in the top layer, so they stay above dialogs, drawers and sheets.',
      component: ZardDemoSonnerWithDialogComponent,
      codeData: SONNER_DEMO_WITH_DIALOG,
    },
  ],
};
