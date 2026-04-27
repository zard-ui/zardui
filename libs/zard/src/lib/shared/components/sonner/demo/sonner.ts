import { SONNER_DEMO_DEFAULT } from '@generated/components/sonner/demo/default';
import { SONNER_DEMO_DESCRIPTION } from '@generated/components/sonner/demo/description';
import { SONNER_DEMO_POSITION } from '@generated/components/sonner/demo/position';
import { SONNER_DEMO_TYPES } from '@generated/components/sonner/demo/types';
import { SONNER_CLI_ADD } from '@generated/installation/cli/add-sonner';
import { SONNER_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-sonner';
import { SONNER_MANUAL_CODE } from '@generated/installation/manual/sonner';
import { SONNER_REGISTER } from '@generated/installation/register/register-sonner';
import { SONNER_USAGE_CODE, SONNER_USAGE_IMPORT } from '@generated/usage/sonner';

import { ZardDemoSonnerDefaultComponent } from './default';
import { ZardDemoSonnerDescriptionComponent } from './description';
import { ZardDemoSonnerPositionComponent } from './position';
import { ZardDemoSonnerTypesComponent } from './types';
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
    component: ZardDemoSonnerDefaultComponent,
    codeData: SONNER_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'types',
      component: ZardDemoSonnerTypesComponent,
      codeData: SONNER_DEMO_TYPES,
    },
    {
      name: 'description',
      component: ZardDemoSonnerDescriptionComponent,
      codeData: SONNER_DEMO_DESCRIPTION,
    },
    {
      name: 'position',
      description: 'Use the `position` option to change the position of the toast.',
      component: ZardDemoSonnerPositionComponent,
      codeData: SONNER_DEMO_POSITION,
    },
  ],
};
