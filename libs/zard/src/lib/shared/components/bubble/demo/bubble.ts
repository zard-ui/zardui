import { BUBBLE_DEMO_ALIGNMENT } from '@generated/components/bubble/demo/alignment';
import { BUBBLE_DEMO_COLLAPSIBLE } from '@generated/components/bubble/demo/collapsible';
import { BUBBLE_DEMO_GROUP } from '@generated/components/bubble/demo/group';
import { BUBBLE_DEMO_LINKS_AND_BUTTONS } from '@generated/components/bubble/demo/links-and-buttons';
import { BUBBLE_DEMO_POPOVER } from '@generated/components/bubble/demo/popover';
import { BUBBLE_DEMO_PREVIEW } from '@generated/components/bubble/demo/preview';
import { BUBBLE_DEMO_REACTIONS } from '@generated/components/bubble/demo/reactions';
import { BUBBLE_DEMO_SHORTHAND } from '@generated/components/bubble/demo/shorthand';
import { BUBBLE_DEMO_TOOLTIP } from '@generated/components/bubble/demo/tooltip';
import { BUBBLE_DEMO_VARIANTS } from '@generated/components/bubble/demo/variants';
import { BUBBLE_CLI_ADD } from '@generated/installation/cli/add-bubble';
import { BUBBLE_MANUAL_CODE } from '@generated/installation/manual/bubble';
import { BUBBLE_USAGE_CODE, BUBBLE_USAGE_IMPORT } from '@generated/usage/bubble';

import { ZardDemoBubbleAlignmentComponent } from './alignment';
import { ZardDemoBubbleCollapsibleComponent } from './collapsible';
import { ZardDemoBubbleGroupComponent } from './group';
import { ZardDemoBubbleLinksAndButtonsComponent } from './links-and-buttons';
import { ZardDemoBubblePopoverComponent } from './popover';
import { ZardDemoBubblePreviewComponent } from './preview';
import { ZardDemoBubbleReactionsComponent } from './reactions';
import { ZardDemoBubbleShorthandComponent } from './shorthand';
import { ZardDemoBubbleTooltipComponent } from './tooltip';
import { ZardDemoBubbleVariantsComponent } from './variants';
import { BUBBLE_API } from '../doc/api';

export const BUBBLE = {
  componentName: 'bubble',
  componentType: 'bubble',
  description:
    'A message bubble for chat and conversational UI. `z-bubble` frames one turn of content with a `zVariant` treatment and a `zAlign` side, and pairs with `z-bubble-reactions` and `z-bubble-group` to build a full thread.',
  about: {
    description:
      '`z-bubble` renders the message surface only. Project `z-bubble-content` for the bubble body, or apply it as an attribute on a native `button`/`a` to turn the whole turn into an interactive link or quick reply. Add `z-bubble-reactions` for a badge row anchored to a corner of the bubble, and wrap consecutive turns from the same sender in `z-bubble-group` to stack them tightly. For a full conversational turn with an avatar, sender name, timestamp, and message-level actions, compose `z-message` instead — `z-bubble` stays intentionally scoped to just the surface.',
  },
  api: BUBBLE_API,
  installData: {
    cliAdd: BUBBLE_CLI_ADD,
    manualCode: BUBBLE_MANUAL_CODE,
  },
  usage: { importBlock: BUBBLE_USAGE_IMPORT, codeBlock: BUBBLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoBubblePreviewComponent,
    codeData: BUBBLE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'variants',
      description:
        'The seven `zVariant` treatments on `z-bubble` — `default`, `secondary`, `muted`, `tinted`, `outline`, `ghost`, and `destructive` — from a strong primary bubble to unframed `ghost` content that spans the full row.',
      component: ZardDemoBubbleVariantsComponent,
      codeData: BUBBLE_DEMO_VARIANTS,
    },
    {
      name: 'alignment',
      description:
        'Set `zAlign="start"` (the default) or `zAlign="end"` on `z-bubble` to place a turn on the left or right of the thread — start for the other party, end for the current user.',
      component: ZardDemoBubbleAlignmentComponent,
      codeData: BUBBLE_DEMO_ALIGNMENT,
    },
    {
      name: 'shorthand',
      description:
        'A zard-only shorthand: skip `z-bubble-content` for plain text and project it straight into `z-bubble` — a bubble with no projected content gets the content surface for free. Reach for the explicit `z-bubble-content` element when you need a class override, or an interactive button/link surface.',
      component: ZardDemoBubbleShorthandComponent,
      codeData: BUBBLE_DEMO_SHORTHAND,
    },
    {
      name: 'group',
      description:
        'Wrap consecutive `z-bubble` elements from the same sender in `z-bubble-group` to stack them with a tighter gap, so a multi-message reply reads as one turn instead of three separate bubbles. Set `zAlign` on each `z-bubble`, not on the group.',
      component: ZardDemoBubbleGroupComponent,
      codeData: BUBBLE_DEMO_GROUP,
    },
    {
      name: 'links-and-buttons',
      description:
        'Apply `z-bubble-content` as an attribute on a native `button` or `a` instead of projecting it as an element, so the whole bubble becomes an interactive quick reply or link — the bubble already styles that hover state through `[data-slot=bubble-content]:is(button,a)`.',
      component: ZardDemoBubbleLinksAndButtonsComponent,
      codeData: BUBBLE_DEMO_LINKS_AND_BUTTONS,
    },
    {
      name: 'reactions',
      description:
        'Use `z-bubble-reactions` to render a row of reactions or quick-action buttons anchored to a corner of the bubble. `zSide` (`top`/`bottom`) and `zAlign` (`start`/`end`) position it — the row overlaps the bubble edge, so give it room with a larger gap.',
      component: ZardDemoBubbleReactionsComponent,
      codeData: BUBBLE_DEMO_REACTIONS,
    },
    {
      name: 'collapsible',
      description:
        'Long bubble content is not truncated automatically — compose `z-collapsible` inside `z-bubble-content` and pair a `z-button` with `[z-collapsible-trigger]` for a real "Show more"/"Show less" toggle.',
      component: ZardDemoBubbleCollapsibleComponent,
      codeData: BUBBLE_DEMO_COLLAPSIBLE,
    },
    {
      name: 'tooltip',
      description:
        'Compose a bubble reaction with `[zTooltip]` to reveal metadata on hover, such as when a message was read.',
      component: ZardDemoBubbleTooltipComponent,
      codeData: BUBBLE_DEMO_TOOLTIP,
    },
    {
      name: 'popover',
      description:
        'Pair a bubble reaction with `[zPopover]` to surface more information on demand, such as the full error message behind a failed action.',
      component: ZardDemoBubblePopoverComponent,
      codeData: BUBBLE_DEMO_POPOVER,
    },
  ],
};
