import { ASPECT_RATIO_DEMO_PORTRAIT } from '@generated/components/aspect-ratio/demo/portrait';
import { ASPECT_RATIO_DEMO_PREVIEW } from '@generated/components/aspect-ratio/demo/preview';
import { ASPECT_RATIO_DEMO_RTL } from '@generated/components/aspect-ratio/demo/rtl';
import { ASPECT_RATIO_DEMO_SQUARE } from '@generated/components/aspect-ratio/demo/square';
import { ASPECT_RATIO_CLI_ADD } from '@generated/installation/cli/add-aspect-ratio';
import { ASPECT_RATIO_MANUAL_CODE } from '@generated/installation/manual/aspect-ratio';
import { ASPECT_RATIO_USAGE_CODE, ASPECT_RATIO_USAGE_IMPORT } from '@generated/usage/aspect-ratio';

import { ZardDemoAspectRatioPortraitComponent } from './portrait';
import { ZardDemoAspectRatioPreviewComponent } from './preview';
import { ZardDemoAspectRatioRtlComponent } from './rtl';
import { ZardDemoAspectRatioSquareComponent } from './square';
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
  preview: {
    name: 'preview',
    component: ZardDemoAspectRatioPreviewComponent,
    codeData: ASPECT_RATIO_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'square',
      description:
        'A square aspect ratio component using `[zRatio]="1 / 1"`. This is useful for displaying images in a square format.',
      component: ZardDemoAspectRatioSquareComponent,
      codeData: ASPECT_RATIO_DEMO_SQUARE,
    },
    {
      name: 'portrait',
      description:
        'A portrait aspect ratio component using `[zRatio]="9 / 16"`. This is useful for displaying images in a portrait format.',
      component: ZardDemoAspectRatioPortraitComponent,
      codeData: ASPECT_RATIO_DEMO_PORTRAIT,
    },
    {
      name: 'rtl',
      description: 'The box keeps its ratio in a right-to-left layout; only the surrounding content mirrors.',
      component: ZardDemoAspectRatioRtlComponent,
      codeData: ASPECT_RATIO_DEMO_RTL,
    },
  ],
};
