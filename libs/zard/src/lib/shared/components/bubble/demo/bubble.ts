import { BUBBLE_DEMO_ALIGNMENT } from '@generated/components/bubble/demo/alignment';
import { BUBBLE_DEMO_COLLAPSIBLE } from '@generated/components/bubble/demo/collapsible';
import { BUBBLE_DEMO_DEFAULT } from '@generated/components/bubble/demo/default';
import { BUBBLE_DEMO_GROUP } from '@generated/components/bubble/demo/group';
import { BUBBLE_DEMO_LINK_BUTTON } from '@generated/components/bubble/demo/link-button';
import { BUBBLE_DEMO_POPOVER } from '@generated/components/bubble/demo/popover';
import { BUBBLE_DEMO_REACTIONS } from '@generated/components/bubble/demo/reactions';
import { BUBBLE_DEMO_SHORTHAND } from '@generated/components/bubble/demo/shorthand';
import { BUBBLE_DEMO_TOOLTIP } from '@generated/components/bubble/demo/tooltip';
import { BUBBLE_DEMO_VARIANTS } from '@generated/components/bubble/demo/variants';
import { BUBBLE_CLI_ADD } from '@generated/installation/cli/add-bubble';
import { BUBBLE_MANUAL_CODE } from '@generated/installation/manual/bubble';
import { BUBBLE_USAGE_CODE, BUBBLE_USAGE_IMPORT } from '@generated/usage/bubble';

import { ZardDemoBubbleAlignmentComponent } from './alignment';
import { ZardDemoBubbleCollapsibleComponent } from './collapsible';
import { ZardDemoBubbleDefaultComponent } from './default';
import { ZardDemoBubbleGroupComponent } from './group';
import { ZardDemoBubbleLinkButtonComponent } from './link-button';
import { ZardDemoBubblePopoverComponent } from './popover';
import { ZardDemoBubbleReactionsComponent } from './reactions';
import { ZardDemoBubbleShorthandComponent } from './shorthand';
import { ZardDemoBubbleTooltipComponent } from './tooltip';
import { ZardDemoBubbleVariantsComponent } from './variants';
import { BUBBLE_API } from '../doc/api';

export const BUBBLE = {
  componentName: 'bubble',
  componentType: 'bubble',
  description:
    'Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.',
  api: BUBBLE_API,
  installData: {
    cliAdd: BUBBLE_CLI_ADD,
    manualCode: BUBBLE_MANUAL_CODE,
  },
  usage: { importBlock: BUBBLE_USAGE_IMPORT, codeBlock: BUBBLE_USAGE_CODE },
  examples: [
    { name: 'default', component: ZardDemoBubbleDefaultComponent, codeData: BUBBLE_DEMO_DEFAULT },
    { name: 'variants', component: ZardDemoBubbleVariantsComponent, codeData: BUBBLE_DEMO_VARIANTS },
    { name: 'alignment', component: ZardDemoBubbleAlignmentComponent, codeData: BUBBLE_DEMO_ALIGNMENT },
    { name: 'group', component: ZardDemoBubbleGroupComponent, codeData: BUBBLE_DEMO_GROUP },
    { name: 'link-button', component: ZardDemoBubbleLinkButtonComponent, codeData: BUBBLE_DEMO_LINK_BUTTON },
    { name: 'reactions', component: ZardDemoBubbleReactionsComponent, codeData: BUBBLE_DEMO_REACTIONS },
    { name: 'collapsible', component: ZardDemoBubbleCollapsibleComponent, codeData: BUBBLE_DEMO_COLLAPSIBLE },
    { name: 'tooltip', component: ZardDemoBubbleTooltipComponent, codeData: BUBBLE_DEMO_TOOLTIP },
    { name: 'popover', component: ZardDemoBubblePopoverComponent, codeData: BUBBLE_DEMO_POPOVER },
    { name: 'shorthand', component: ZardDemoBubbleShorthandComponent, codeData: BUBBLE_DEMO_SHORTHAND },
  ],
};
