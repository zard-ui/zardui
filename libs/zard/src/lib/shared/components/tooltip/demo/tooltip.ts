import { TOOLTIP_DEMO_CLICK } from '@generated/components/tooltip/demo/click';
import { TOOLTIP_DEMO_DISABLED_BUTTON } from '@generated/components/tooltip/demo/disabled-button';
import { TOOLTIP_DEMO_ON_SHOW_HIDE } from '@generated/components/tooltip/demo/on-show-hide';
import { TOOLTIP_DEMO_PREVIEW } from '@generated/components/tooltip/demo/preview';
import { TOOLTIP_DEMO_SIDE } from '@generated/components/tooltip/demo/side';
import { TOOLTIP_DEMO_WITH_KBD } from '@generated/components/tooltip/demo/with-kbd';
import { TOOLTIP_CLI_ADD } from '@generated/installation/cli/add-tooltip';
import { TOOLTIP_MANUAL_CODE } from '@generated/installation/manual/tooltip';
import { TOOLTIP_USAGE_CODE, TOOLTIP_USAGE_IMPORT } from '@generated/usage/tooltip';

import { ZardDemoTooltipDisabledButtonComponent } from '@/shared/components/tooltip/demo/disabled-button';
import { ZardDemoTooltipWithKbdComponent } from '@/shared/components/tooltip/demo/with-kbd';

import { ZardDemoTooltipClickComponent } from './click';
import { ZardDemoTooltipOnShowHideComponent } from './on-show-hide';
import { ZardDemoTooltipPreviewComponent } from './preview';
import { ZardDemoTooltipSideComponent } from './side';
import { TOOLTIP_API } from '../doc/api';

export const TOOLTIP = {
  componentName: 'tooltip',
  componentType: 'tooltip',
  api: TOOLTIP_API,
  description:
    'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  about: {
    description:
      "Reach for `[zTooltip]` when hovering or focusing a trigger should surface a short text label — a button's name, a truncated value — never rich or interactive content. It opens and closes fast (`zShowDelay`/`zHideDelay` default to 150ms/100ms) since it only needs to confirm what the trigger does. Use `[zHoverCard]`/`z-hover-card` instead for a rich, non-essential preview that can tolerate a slower 700ms/300ms delay, and `[zPopover]`/`z-popover` for a click-opened panel of interactive content. Compose a `z-kbd`/`z-kbd-group` inside the `zTooltip` template to pair a label with its keyboard shortcut.",
  },
  installData: {
    cliAdd: TOOLTIP_CLI_ADD,
    manualCode: TOOLTIP_MANUAL_CODE,
  },
  usage: { importBlock: TOOLTIP_USAGE_IMPORT, codeBlock: TOOLTIP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTooltipPreviewComponent,
    codeData: TOOLTIP_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'side',
      description:
        'Set `zPosition` (shadcn calls this input `side`) to `top`, `bottom`, `left` or `right` to choose which side of the trigger the tooltip opens on.',
      component: ZardDemoTooltipSideComponent,
      codeData: TOOLTIP_DEMO_SIDE,
    },
    {
      name: 'with-keyboard-shortcut',
      description: 'Compose a `z-kbd` inside the `zTooltip` template to show the shortcut for the action it labels.',
      component: ZardDemoTooltipWithKbdComponent,
      codeData: TOOLTIP_DEMO_WITH_KBD,
    },
    {
      name: 'disabled-button',
      description:
        'A disabled `<button>` fires no pointer events, so `[zTooltip]` placed on it never triggers. Wrap the button in a focusable `<span tabindex="0">` and put `[zTooltip]` on the wrapper instead.',
      component: ZardDemoTooltipDisabledButtonComponent,
      codeData: TOOLTIP_DEMO_DISABLED_BUTTON,
    },
    {
      name: 'click',
      description:
        'Set `zTrigger="click"` to open the tooltip on click instead of hover. Keep click-triggered tooltips to a single short label; for a click-opened panel of interactive content, reach for `[zPopover]` instead.',
      component: ZardDemoTooltipClickComponent,
      codeData: TOOLTIP_DEMO_CLICK,
    },
    {
      name: 'on-show-hide',
      description:
        'Listen to `(zShow)` and `(zHide)` to react to the tooltip opening and closing, for example to sync external state.',
      component: ZardDemoTooltipOnShowHideComponent,
      codeData: TOOLTIP_DEMO_ON_SHOW_HIDE,
    },
  ],
};
