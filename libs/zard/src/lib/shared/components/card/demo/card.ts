import { CARD_DEMO_DEFAULT } from '@generated/components/card/demo/default';
import { CARD_DEMO_IMAGE } from '@generated/components/card/demo/image';
import { CARD_DEMO_SIZE } from '@generated/components/card/demo/size';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';
import { CARD_MANUAL_CODE } from '@generated/installation/manual/card';
import { CARD_USAGE_IMPORT, CARD_USAGE_CODE } from '@generated/usage/card';

import { ZardDemoCardImageComponent } from '@/shared/components/card/demo/image';
import { ZardDemoCardSmallComponent } from '@/shared/components/card/demo/size';

import { ZardDemoCardDefaultComponent } from './default';
import { CARD_API } from '../doc/api';

export const CARD = {
  api: CARD_API,
  componentName: 'card',
  componentType: 'card',
  description: 'Displays a card with header, content, and footer.',
  fullWidth: true,
  installData: {
    cliAdd: CARD_CLI_ADD,
    manualCode: CARD_MANUAL_CODE,
  },
  usage: { importBlock: CARD_USAGE_IMPORT, codeBlock: CARD_USAGE_CODE },
  preview: {
    name: 'default',
    component: ZardDemoCardDefaultComponent,
    isDefineSizeContainer: false,
    codeData: CARD_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'size',
      description:
        'Use the zSize="sm" input to set the size of the card to small. The small size variant uses smaller spacing.',
      component: ZardDemoCardSmallComponent,
      isDefineSizeContainer: false,
      codeData: CARD_DEMO_SIZE,
    },
    {
      name: 'image',
      description: 'Add an image before the card header to create a card with an image.',
      component: ZardDemoCardImageComponent,
      isDefineSizeContainer: false,
      codeData: CARD_DEMO_IMAGE,
    },
  ],
};
