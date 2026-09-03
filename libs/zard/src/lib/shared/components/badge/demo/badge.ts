import { BADGE_DEMO_CUSTOM_COLORS } from '@generated/components/badge/demo/custom-colors';
import { BADGE_DEMO_LINK } from '@generated/components/badge/demo/link';
import { BADGE_DEMO_PREVIEW } from '@generated/components/badge/demo/preview';
import { BADGE_DEMO_VARIANTS } from '@generated/components/badge/demo/variants';
import { BADGE_DEMO_WITH_ICON } from '@generated/components/badge/demo/with-icon';
import { BADGE_DEMO_WITH_SPINNER } from '@generated/components/badge/demo/with-spinner';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BADGE_MANUAL_CODE } from '@generated/installation/manual/badge';
import { BADGE_USAGE_IMPORT, BADGE_USAGE_CODE } from '@generated/usage/badge';

import { ZardDemoBadgeCustomColorsComponent } from '@/shared/components/badge/demo/custom-colors';
import { ZardDemoBadgeLinkComponent } from '@/shared/components/badge/demo/link';
import { ZardDemoBadgeWithIconComponent } from '@/shared/components/badge/demo/with-icon';
import { ZardDemoBadgeWithSpinnerComponent } from '@/shared/components/badge/demo/with-spinner';

import { ZardDemoBadgePreviewComponent } from './preview';
import { ZardDemoBadgeVariantsComponent } from './variants';
import { BADGE_API } from '../doc/api';

export const BADGE = {
  api: BADGE_API,
  componentName: 'badge',
  componentType: 'badge',
  description: 'Displays a badge or a component that looks like a badge.',
  about: {
    description:
      'The selector is `z-badge, a[z-badge]`. Use `<z-badge>` as a standalone element for a static label, or apply the `z-badge` attribute to a native `<a>` — `<a z-badge>` — when the badge itself needs to navigate, as in the `link` example.',
  },
  installData: {
    cliAdd: BADGE_CLI_ADD,
    manualCode: BADGE_MANUAL_CODE,
  },
  usage: { importBlock: BADGE_USAGE_IMPORT, codeBlock: BADGE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoBadgePreviewComponent,
    codeData: BADGE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'variants',
      description:
        'Set `zType` to switch between the six variants the badge implements: default, secondary, destructive, outline, ghost and link.',
      component: ZardDemoBadgeVariantsComponent,
      codeData: BADGE_DEMO_VARIANTS,
    },
    {
      name: 'with-icon',
      description: 'Project an icon before or after the badge text to place it at the start or end.',
      component: ZardDemoBadgeWithIconComponent,
      codeData: BADGE_DEMO_WITH_ICON,
    },
    {
      name: 'with-spinner',
      description: 'Compose `z-spinner` inside a badge to show a loading state.',
      component: ZardDemoBadgeWithSpinnerComponent,
      codeData: BADGE_DEMO_WITH_SPINNER,
    },
    {
      name: 'link',
      description: 'Apply `z-badge` to a native `<a>` so the badge behaves as a real link.',
      component: ZardDemoBadgeLinkComponent,
      codeData: BADGE_DEMO_LINK,
    },
    {
      name: 'custom-colors',
      description: 'Override the default colors by passing custom classes through `class`.',
      component: ZardDemoBadgeCustomColorsComponent,
      codeData: BADGE_DEMO_CUSTOM_COLORS,
    },
  ],
};
