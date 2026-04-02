import { AVATAR_DEMO_BASIC } from '@generated/components/avatar/demo/basic';
import { AVATAR_DEMO_STATUS } from '@generated/components/avatar/demo/status';
import { AVATAR_CLI_ADD } from '@generated/installation/cli/add-avatar';
import { AVATAR_MANUAL_CODE } from '@generated/installation/manual/avatar';

import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarStatusComponent } from './status';

export const AVATAR = {
  componentName: 'avatar',
  componentType: 'avatar',
  description: 'An image element with a fallback for representing the user.',
  installData: {
    cliAdd: AVATAR_CLI_ADD,
    manualCode: AVATAR_MANUAL_CODE,
  },
  examples: [
    {
      name: 'basic',
      component: ZardDemoAvatarBasicComponent,
      codeData: AVATAR_DEMO_BASIC,
    },
    {
      name: 'status',
      component: ZardDemoAvatarStatusComponent,
      codeData: AVATAR_DEMO_STATUS,
    },
  ],
};
