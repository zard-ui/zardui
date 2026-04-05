import { TOAST_DEMO_ADVANCED } from '@generated/components/toast/demo/advanced';
import { TOAST_DEMO_DEFAULT } from '@generated/components/toast/demo/default';
import { TOAST_DEMO_DESTRUCTIVE } from '@generated/components/toast/demo/destructive';
import { TOAST_DEMO_LOADING } from '@generated/components/toast/demo/loading';
import { TOAST_DEMO_POSITION } from '@generated/components/toast/demo/position';
import { TOAST_DEMO_SUCCESS } from '@generated/components/toast/demo/success';
import { TOAST_CLI_ADD } from '@generated/installation/cli/add-toast';
import { TOAST_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-toast';
import { TOAST_MANUAL_CODE } from '@generated/installation/manual/toast';
import { TOAST_REGISTER } from '@generated/installation/register/register-toast';
import { TOAST_USAGE_CODE, TOAST_USAGE_IMPORT } from '@generated/usage/toast';

import { ZardDemoToastAdvancedComponent } from './advanced';
import { ZardDemoToastDefaultComponent } from './default';
import { ZardDemoToastDestructiveComponent } from './destructive';
import { ZardDemoToastLoadingComponent } from './loading';
import { ZardDemoToastPositionComponent } from './position';
import { ZardDemoToastSuccessComponent } from './success';
import { TOAST_API } from '../doc/api';

export const TOAST = {
  componentName: 'toast',
  componentType: 'toast',
  api: TOAST_API,
  description: 'A succinct message that is displayed temporarily.',
  installData: {
    cliAdd: TOAST_CLI_ADD,
    manualCode: TOAST_MANUAL_CODE,
    manualDeps: TOAST_MANUAL_INSTALL_DEPS,
    register: TOAST_REGISTER,
  },
  usage: { importBlock: TOAST_USAGE_IMPORT, codeBlock: TOAST_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoToastDefaultComponent,
      codeData: TOAST_DEMO_DEFAULT,
    },
    {
      name: 'destructive',
      component: ZardDemoToastDestructiveComponent,
      codeData: TOAST_DEMO_DESTRUCTIVE,
    },
    {
      name: 'success',
      component: ZardDemoToastSuccessComponent,
      codeData: TOAST_DEMO_SUCCESS,
    },
    {
      name: 'loading',
      component: ZardDemoToastLoadingComponent,
      codeData: TOAST_DEMO_LOADING,
    },
    {
      name: 'advanced',
      component: ZardDemoToastAdvancedComponent,
      codeData: TOAST_DEMO_ADVANCED,
    },
    {
      name: 'position',
      component: ZardDemoToastPositionComponent,
      codeData: TOAST_DEMO_POSITION,
    },
  ],
};
