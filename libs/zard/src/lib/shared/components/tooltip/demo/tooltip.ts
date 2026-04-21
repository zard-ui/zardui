import { TOOLTIP_DEMO_CLICK } from '@generated/components/tooltip/demo/click';
import { TOOLTIP_DEMO_DISABLED } from '@generated/components/tooltip/demo/disabled';
import { TOOLTIP_DEMO_EVENTS } from '@generated/components/tooltip/demo/events';
import { TOOLTIP_DEMO_HOVER } from '@generated/components/tooltip/demo/hover';
import { TOOLTIP_DEMO_POSITION } from '@generated/components/tooltip/demo/position';
import { TOOLTIP_DEMO_WITH_KBD } from '@generated/components/tooltip/demo/with-kbd';
import { TOOLTIP_CLI_ADD } from '@generated/installation/cli/add-tooltip';
import { TOOLTIP_MANUAL_CODE } from '@generated/installation/manual/tooltip';
import { TOOLTIP_USAGE_CODE, TOOLTIP_USAGE_IMPORT } from '@generated/usage/tooltip';

import { ZardDemoTooltipDisabledButtonComponent } from '@/shared/components/tooltip/demo/disabled';
import { ZardDemoTooltipWithKbdComponent } from '@/shared/components/tooltip/demo/with-kbd';

import { ZardDemoTooltipClickComponent } from './click';
import { ZardDemoTooltipEventsComponent } from './events';
import { ZardDemoTooltipHoverComponent } from './hover';
import { ZardDemoTooltipPositionComponent } from './position';
import { TOOLTIP_API } from '../doc/api';

export const TOOLTIP = {
  componentName: 'tooltip',
  componentType: 'tooltip',
  api: TOOLTIP_API,
  description:
    'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  installData: {
    cliAdd: TOOLTIP_CLI_ADD,
    manualCode: TOOLTIP_MANUAL_CODE,
  },
  usage: { importBlock: TOOLTIP_USAGE_IMPORT, codeBlock: TOOLTIP_USAGE_CODE },
  examples: [
    {
      name: 'hover',
      component: ZardDemoTooltipHoverComponent,
      codeData: TOOLTIP_DEMO_HOVER,
    },
    {
      name: 'click',
      component: ZardDemoTooltipClickComponent,
      codeData: TOOLTIP_DEMO_CLICK,
    },
    {
      name: 'position',
      component: ZardDemoTooltipPositionComponent,
      codeData: TOOLTIP_DEMO_POSITION,
    },
    {
      name: 'with-keyboard-shortcut',
      component: ZardDemoTooltipWithKbdComponent,
      codeData: TOOLTIP_DEMO_WITH_KBD,
    },
    {
      name: 'disabled-button',
      component: ZardDemoTooltipDisabledButtonComponent,
      codeData: TOOLTIP_DEMO_DISABLED,
    },
    {
      name: 'events',
      component: ZardDemoTooltipEventsComponent,
      codeData: TOOLTIP_DEMO_EVENTS,
    },
  ],
};
