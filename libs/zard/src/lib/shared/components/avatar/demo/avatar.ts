import { AVATAR_DEMO_BADGE } from '@generated/components/avatar/demo/badge';
import { AVATAR_DEMO_BADGE_WITH_ICON } from '@generated/components/avatar/demo/badge-with-icon';
import { AVATAR_DEMO_BASIC } from '@generated/components/avatar/demo/basic';
import { AVATAR_DEMO_DROPDOWN } from '@generated/components/avatar/demo/dropdown';
import { AVATAR_DEMO_GROUP } from '@generated/components/avatar/demo/group';
import { AVATAR_DEMO_GROUP_COUNT } from '@generated/components/avatar/demo/group-count';
import { AVATAR_DEMO_GROUP_WITH_ICON } from '@generated/components/avatar/demo/group-with-icon';
import { AVATAR_DEMO_PREVIEW } from '@generated/components/avatar/demo/preview';
import { AVATAR_DEMO_SIZES } from '@generated/components/avatar/demo/sizes';
import { AVATAR_CLI_ADD } from '@generated/installation/cli/add-avatar';
import { AVATAR_MANUAL_CODE } from '@generated/installation/manual/avatar';
import { AVATAR_USAGE_IMPORT, AVATAR_USAGE_CODE } from '@generated/usage/avatar';

import { ZardDemoAvatarBadgeComponent } from './badge';
import { ZardDemoAvatarBadgeWithIconComponent } from './badge-with-icon';
import { ZardDemoAvatarBasicComponent } from './basic';
import { ZardDemoAvatarDropdownComponent } from './dropdown';
import { ZardDemoAvatarGroupComponent } from './group';
import { ZardDemoAvatarGroupCountComponent } from './group-count';
import { ZardDemoAvatarGroupWithIconComponent } from './group-with-icon';
import { ZardDemoAvatarPreviewComponent } from './preview';
import { ZardDemoAvatarSizesComponent } from './sizes';
import { AVATAR_API } from '../doc/api';

export const AVATAR = {
  api: AVATAR_API,
  componentName: 'avatar',
  componentType: 'avatar',
  description: 'An image element with a fallback for representing the user.',
  about: {
    title: 'Avatar, group and count',
    description:
      '`z-avatar` renders an image (`zSrc`) with a `zFallback` shown while it loads or if it errors. Stack several inside `z-avatar-group` — `zOrientation` switches between a horizontal and vertical stack, and each direct child picks up a ring and consistent spacing automatically. Append a `z-avatar-group-count` as the last child to show how many more members the stack does not display; it renders as a "+N" chip sized like the avatars around it.',
  },
  installData: {
    cliAdd: AVATAR_CLI_ADD,
    manualCode: AVATAR_MANUAL_CODE,
  },
  usage: { importBlock: AVATAR_USAGE_IMPORT, codeBlock: AVATAR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoAvatarPreviewComponent,
    codeData: AVATAR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'Set `zSrc` for the image and `zFallback` for the text shown while it loads or if it errors.',
      component: ZardDemoAvatarBasicComponent,
      codeData: AVATAR_DEMO_BASIC,
    },
    {
      name: 'sizes',
      description: '`zSize` accepts `sm` (24px), `default` (32px) and `lg` (40px).',
      component: ZardDemoAvatarSizesComponent,
      codeData: AVATAR_DEMO_SIZES,
    },
    {
      name: 'badge',
      description: 'Set `zShowBadge` and `zBadgeClass` to render a status dot in the corner.',
      component: ZardDemoAvatarBadgeComponent,
      codeData: AVATAR_DEMO_BADGE,
    },
    {
      name: 'badge-with-icon',
      description: 'Pass an icon name to `zBadgeIcon` to render it inside the badge instead of a plain dot.',
      component: ZardDemoAvatarBadgeWithIconComponent,
      codeData: AVATAR_DEMO_BADGE_WITH_ICON,
    },
    {
      name: 'group',
      description: 'Wrap avatars in `z-avatar-group`; `zOrientation` switches between a horizontal and vertical stack.',
      component: ZardDemoAvatarGroupComponent,
      codeData: AVATAR_DEMO_GROUP,
    },
    {
      name: 'group-with-icon',
      description:
        'A group member can carry an icon badge via `zBadgeIcon` to call out a role, such as a verified owner.',
      component: ZardDemoAvatarGroupWithIconComponent,
      codeData: AVATAR_DEMO_GROUP_WITH_ICON,
    },
    {
      name: 'group-count',
      description:
        'Append `z-avatar-group-count` with `zCount` to show how many more members the stack does not display.',
      component: ZardDemoAvatarGroupCountComponent,
      codeData: AVATAR_DEMO_GROUP_COUNT,
    },
    {
      name: 'dropdown',
      description:
        'Use an avatar as a `[z-dropdown]` trigger to open a `z-dropdown-menu-content` with account actions.',
      component: ZardDemoAvatarDropdownComponent,
      codeData: AVATAR_DEMO_DROPDOWN,
    },
  ],
};
