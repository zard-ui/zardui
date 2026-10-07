import { EMPTY_DEMO_AVATAR } from '@generated/components/empty/demo/avatar';
import { EMPTY_DEMO_AVATAR_GROUP } from '@generated/components/empty/demo/avatar-group';
import { EMPTY_DEMO_BACKGROUND } from '@generated/components/empty/demo/background';
import { EMPTY_DEMO_INPUT_GROUP } from '@generated/components/empty/demo/input-group';
import { EMPTY_DEMO_OUTLINE } from '@generated/components/empty/demo/outline';
import { EMPTY_DEMO_PREVIEW } from '@generated/components/empty/demo/preview';
import { EMPTY_CLI_ADD } from '@generated/installation/cli/add-empty';
import { EMPTY_MANUAL_CODE } from '@generated/installation/manual/empty';
import { EMPTY_USAGE_IMPORT, EMPTY_USAGE_CODE } from '@generated/usage/empty';

import { ZardDemoEmptyAvatarComponent } from './avatar';
import { ZardDemoEmptyAvatarGroupComponent } from './avatar-group';
import { ZardDemoEmptyBackgroundComponent } from './background';
import { ZardDemoEmptyInputGroupComponent } from './input-group';
import { ZardDemoEmptyOutlineComponent } from './outline';
import { ZardDemoEmptyPreviewComponent } from './preview';
import { EMPTY_API } from '../doc/api';

export const EMPTY = {
  componentName: 'empty',
  componentPath: 'empty',
  description: 'Use the Empty component to display an empty state.',
  api: EMPTY_API,
  installData: {
    cliAdd: EMPTY_CLI_ADD,
    manualCode: EMPTY_MANUAL_CODE,
  },
  usage: { importBlock: EMPTY_USAGE_IMPORT, codeBlock: EMPTY_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoEmptyPreviewComponent,
    codeData: EMPTY_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'outline',
      description: 'Use the `border` utility class to create an outline empty state.',
      component: ZardDemoEmptyOutlineComponent,
      codeData: EMPTY_DEMO_OUTLINE,
    },
    {
      name: 'background',
      description: 'Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.',
      component: ZardDemoEmptyBackgroundComponent,
      codeData: EMPTY_DEMO_BACKGROUND,
    },
    {
      name: 'avatar',
      description: 'Set `zImage` to a template projecting a `z-avatar` to represent a person in the empty state.',
      component: ZardDemoEmptyAvatarComponent,
      codeData: EMPTY_DEMO_AVATAR,
    },
    {
      name: 'avatar-group',
      description:
        'Set `zImage` to a template projecting a `z-avatar-group` to represent multiple people in the empty state.',
      component: ZardDemoEmptyAvatarGroupComponent,
      codeData: EMPTY_DEMO_AVATAR_GROUP,
    },
    {
      name: 'input-group',
      description: 'Compose a `z-input-group` to add a search field to the empty state.',
      component: ZardDemoEmptyInputGroupComponent,
      codeData: EMPTY_DEMO_INPUT_GROUP,
    },
  ],
};
