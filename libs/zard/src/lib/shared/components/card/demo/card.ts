import { CARD_DEMO_IMAGE } from '@generated/components/card/demo/image';
import { CARD_DEMO_PREVIEW } from '@generated/components/card/demo/preview';
import { CARD_DEMO_SIZE } from '@generated/components/card/demo/size';
import { CARD_DEMO_SPACING } from '@generated/components/card/demo/spacing';
import { CARD_DEMO_TERMS_OF_SERVICE } from '@generated/components/card/demo/terms-of-service';
import { CARD_CLI_ADD } from '@generated/installation/cli/add-card';
import { CARD_MANUAL_CODE } from '@generated/installation/manual/card';
import { CARD_USAGE_IMPORT, CARD_USAGE_CODE } from '@generated/usage/card';

import { ZardDemoCardImageComponent } from '@/shared/components/card/demo/image';
import { ZardDemoCardPreviewComponent } from '@/shared/components/card/demo/preview';
import { ZardDemoCardSizeComponent } from '@/shared/components/card/demo/size';
import { ZardDemoCardSpacingComponent } from '@/shared/components/card/demo/spacing';
import { ZardDemoCardTermsOfServiceComponent } from '@/shared/components/card/demo/terms-of-service';

import { CARD_API } from '../doc/api';

export const CARD = {
  api: CARD_API,
  componentName: 'card',
  componentType: 'card',
  description: 'Displays a card with header, content, and footer.',
  fullWidth: true,
  about: {
    title: 'Composing a card',
    description:
      '`z-card` is a plain container: `z-card-header` groups `z-card-title`, `z-card-description` and an optional `z-card-action` (title and description stack, the action sits in the top-right corner of the header). `z-card-content` holds the body and `z-card-footer` closes the card; both `z-card-header` and `z-card-footer` accept `zHeaderBorder` / `zFooterBorder` to add a divider. `zSize="sm"` on the root tightens the gap and padding of every section at once through a `data-size` attribute selector. Card has no `--card-spacing` CSS variable — override spacing per instance with a `class` on the root or on any section.',
  },
  installData: {
    cliAdd: CARD_CLI_ADD,
    manualCode: CARD_MANUAL_CODE,
  },
  usage: { importBlock: CARD_USAGE_IMPORT, codeBlock: CARD_USAGE_CODE },
  preview: {
    name: 'preview',
    description:
      'A login form composing `z-card-header` / `z-card-content` / `z-card-footer` around `z-field`, `z-field-label` and `input[z-input]`, with a real `z-button` for every action.',
    component: ZardDemoCardPreviewComponent,
    codeData: CARD_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'size',
      description: 'Set zSize to "sm" to switch the card to its compact gap and padding scale.',
      component: ZardDemoCardSizeComponent,
      codeData: CARD_DEMO_SIZE,
    },
    {
      name: 'spacing',
      description:
        'Zard has no --card-spacing CSS variable like shadcn does. Widen or tighten a card by passing class overrides to the root and to each section instead.',
      component: ZardDemoCardSpacingComponent,
      codeData: CARD_DEMO_SPACING,
    },
    {
      name: 'terms-of-service',
      description:
        'A card with a scrollable content section and two footer actions, composed from z-card-content and a zFooterBorder-divided z-card-footer.',
      component: ZardDemoCardTermsOfServiceComponent,
      codeData: CARD_DEMO_TERMS_OF_SERVICE,
    },
    {
      name: 'image',
      description: 'Add an image before the card header to create a card with an image.',
      component: ZardDemoCardImageComponent,
      codeData: CARD_DEMO_IMAGE,
    },
  ],
};
