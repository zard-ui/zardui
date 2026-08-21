import { ASPECT_RATIO_DEMO_AVATAR } from '@generated/components/aspect-ratio/demo/avatar';
import { ASPECT_RATIO_DEMO_CARD_GRID } from '@generated/components/aspect-ratio/demo/card-grid';
import { ASPECT_RATIO_DEMO_EMBED } from '@generated/components/aspect-ratio/demo/embed';
import { ASPECT_RATIO_DEMO_IMAGE } from '@generated/components/aspect-ratio/demo/image';
import { ASPECT_RATIO_CLI_ADD } from '@generated/installation/cli/add-aspect-ratio';
import { ASPECT_RATIO_MANUAL_CODE } from '@generated/installation/manual/aspect-ratio';
import { ASPECT_RATIO_USAGE_CODE, ASPECT_RATIO_USAGE_IMPORT } from '@generated/usage/aspect-ratio';

import { ZardDemoAspectRatioAvatarComponent } from './avatar';
import { ZardDemoAspectRatioCardGridComponent } from './card-grid';
import { ZardDemoAspectRatioEmbedComponent } from './embed';
import { ZardDemoAspectRatioImageComponent } from './image';
import { ASPECT_RATIO_API } from '../doc/api';

export const ASPECT_RATIO = {
  componentName: 'aspect-ratio',
  componentType: 'aspect-ratio',
  description: 'Displays content within a desired ratio.',
  api: ASPECT_RATIO_API,
  installData: {
    cliAdd: ASPECT_RATIO_CLI_ADD,
    manualCode: ASPECT_RATIO_MANUAL_CODE,
  },
  usage: { importBlock: ASPECT_RATIO_USAGE_IMPORT, codeBlock: ASPECT_RATIO_USAGE_CODE },
  examples: [
    {
      name: 'image',
      component: ZardDemoAspectRatioImageComponent,
      codeData: ASPECT_RATIO_DEMO_IMAGE,
    },
    {
      name: 'embed',
      component: ZardDemoAspectRatioEmbedComponent,
      codeData: ASPECT_RATIO_DEMO_EMBED,
    },
    {
      name: 'avatar',
      component: ZardDemoAspectRatioAvatarComponent,
      codeData: ASPECT_RATIO_DEMO_AVATAR,
    },
    {
      name: 'card-grid',
      component: ZardDemoAspectRatioCardGridComponent,
      codeData: ASPECT_RATIO_DEMO_CARD_GRID,
    },
  ],
};
