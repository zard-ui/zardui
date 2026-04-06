import { AVATAR_DEMO_BADGE } from '@generated/components/avatar/demo/badge';
import { AVATAR_DEMO_BASIC } from '@generated/components/avatar/demo/basic';
import { AVATAR_DEMO_GROUP } from '@generated/components/avatar/demo/group';
import { AVATAR_CLI_ADD } from '@generated/installation/cli/add-avatar';
import { AVATAR_MANUAL_CODE } from '@generated/installation/manual/avatar';
import { AVATAR_USAGE_IMPORT, AVATAR_USAGE_CODE } from '@generated/usage/avatar';

import { ZardDemoAvatarGroupComponent } from '@/shared/components/avatar/demo/group';

import { ZardDemoAvatarBadgeComponent } from './badge';
import { ZardDemoAvatarBasicComponent } from './basic';
import { AVATAR_API } from '../doc/api';

export const AVATAR = {
  api: AVATAR_API,
  componentName: 'avatar',
  componentType: 'avatar',
  description: 'An image element with a fallback for representing the user.',
  installData: {
    cliAdd: AVATAR_CLI_ADD,
    manualCode: AVATAR_MANUAL_CODE,
  },
  usage: { importBlock: AVATAR_USAGE_IMPORT, codeBlock: AVATAR_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: ZardDemoAvatarBasicComponent,
      codeData: AVATAR_DEMO_BASIC,
    },
    {
      name: 'badge',
      component: ZardDemoAvatarBadgeComponent,
      codeData: AVATAR_DEMO_BADGE,
    },
    {
      name: 'group',
      component: ZardDemoAvatarGroupComponent,
      codeData: AVATAR_DEMO_GROUP,
    },
  ],
};
