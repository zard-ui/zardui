import { MARKER_DEMO_BORDER } from '@generated/components/marker/demo/border';
import { MARKER_DEMO_LINKS_AND_BUTTONS } from '@generated/components/marker/demo/links-and-buttons';
import { MARKER_DEMO_PREVIEW } from '@generated/components/marker/demo/preview';
import { MARKER_DEMO_SEPARATOR } from '@generated/components/marker/demo/separator';
import { MARKER_DEMO_SHIMMER } from '@generated/components/marker/demo/shimmer';
import { MARKER_DEMO_SHORTHAND } from '@generated/components/marker/demo/shorthand';
import { MARKER_DEMO_STATUS } from '@generated/components/marker/demo/status';
import { MARKER_DEMO_VARIANTS } from '@generated/components/marker/demo/variants';
import { MARKER_DEMO_WITH_ICON } from '@generated/components/marker/demo/with-icon';
import { MARKER_CLI_ADD } from '@generated/installation/cli/add-marker';
import { MARKER_MANUAL_CODE } from '@generated/installation/manual/marker';
import { MARKER_USAGE_CODE, MARKER_USAGE_IMPORT } from '@generated/usage/marker';

import { ZardDemoMarkerBorderComponent } from './border';
import { ZardDemoMarkerLinksAndButtonsComponent } from './links-and-buttons';
import { ZardDemoMarkerPreviewComponent } from './preview';
import { ZardDemoMarkerSeparatorComponent } from './separator';
import { ZardDemoMarkerShimmerComponent } from './shimmer';
import { ZardDemoMarkerShorthandComponent } from './shorthand';
import { ZardDemoMarkerStatusComponent } from './status';
import { ZardDemoMarkerVariantsComponent } from './variants';
import { ZardDemoMarkerWithIconComponent } from './with-icon';
import { MARKER_API } from '../doc/api';

export const MARKER = {
  componentName: 'marker',
  componentType: 'marker',
  description: 'Displays an inline status, system note, bordered row, or labeled separator in a conversation.',
  about: {
    description:
      '`z-marker` renders its own content surface when nothing is projected, so a short row needs no sub-component — reach for the explicit `z-marker-content` element when you need a class override such as `shimmer`, or an icon slot for a whole component like `z-spinner`. Apply the `[z-marker]` attribute selector to a native `a`/`button` to turn the whole row into an interactive link or action. Marker stays scoped to a single inline row — a status update, system note, bordered row, or labeled separator; compose `z-bubble` for a full message surface, or `z-message` for a conversational turn with an avatar, sender, and timestamp.',
  },
  api: MARKER_API,
  installData: {
    cliAdd: MARKER_CLI_ADD,
    manualCode: MARKER_MANUAL_CODE,
  },
  usage: { importBlock: MARKER_USAGE_IMPORT, codeBlock: MARKER_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoMarkerPreviewComponent,
    codeData: MARKER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'variants',
      description:
        'The three `zVariant` values on `z-marker`: `default` for a plain inline row, `border` for a row with a bottom rule, and `separator` for a centered label with divider lines on each side.',
      component: ZardDemoMarkerVariantsComponent,
      codeData: MARKER_DEMO_VARIANTS,
    },
    {
      name: 'status',
      description:
        'Set `role="status"` on `z-marker` and project the real `z-spinner` into `z-marker-icon` so a streaming or in-progress row is announced to assistive tech as it updates.',
      component: ZardDemoMarkerStatusComponent,
      codeData: MARKER_DEMO_STATUS,
    },
    {
      name: 'shimmer',
      description:
        'Add the `shimmer` utility class to `z-marker-content` for an animated streaming-text effect — it turns off automatically when the user prefers reduced motion.',
      component: ZardDemoMarkerShimmerComponent,
      codeData: MARKER_DEMO_SHIMMER,
    },
    {
      name: 'separator',
      description:
        'Set `zVariant="separator"` on `z-marker` for a centered label with divider lines on each side, such as a date or a section break in a conversation.',
      component: ZardDemoMarkerSeparatorComponent,
      codeData: MARKER_DEMO_SEPARATOR,
    },
    {
      name: 'border',
      description:
        'Set `zVariant="border"` on `z-marker` for a status row that keeps the default alignment while adding a bottom rule that separates it from the next row.',
      component: ZardDemoMarkerBorderComponent,
      codeData: MARKER_DEMO_BORDER,
    },
    {
      name: 'with-icon',
      description:
        'Project `z-marker-icon` alongside `z-marker-content` to pair an icon with the row. Add `class="flex-col"` on `z-marker` to stack the icon above the content instead of beside it.',
      component: ZardDemoMarkerWithIconComponent,
      codeData: MARKER_DEMO_WITH_ICON,
    },
    {
      name: 'links-and-buttons',
      description:
        'Apply the `[z-marker]` attribute selector to a native `a` or `button` so the whole row becomes an interactive link or action. The root already underlines and hovers-to-foreground an `a`; give a `button` its own hover class, since that built-in styling only targets `a`.',
      component: ZardDemoMarkerLinksAndButtonsComponent,
      codeData: MARKER_DEMO_LINKS_AND_BUTTONS,
    },
    {
      name: 'shorthand',
      description:
        'A zard-only shorthand: a `z-marker` with no projected `z-marker-content` builds the row itself, so `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is one tag. Project the explicit `z-marker-content` (and `z-marker-icon`) slots when you need a class override such as `shimmer`, or an icon that is a whole component like `z-spinner`.',
      component: ZardDemoMarkerShorthandComponent,
      codeData: MARKER_DEMO_SHORTHAND,
    },
  ],
};
