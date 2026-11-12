import { MESSAGE_SCROLLER_DEMO_JUMP_TO_MESSAGE } from '@generated/components/message-scroller/demo/jump-to-message';
import { MESSAGE_SCROLLER_DEMO_LAST_ANCHOR } from '@generated/components/message-scroller/demo/last-anchor';
import { MESSAGE_SCROLLER_DEMO_LOAD_EARLIER } from '@generated/components/message-scroller/demo/load-earlier';
import { MESSAGE_SCROLLER_DEMO_PREVIEW } from '@generated/components/message-scroller/demo/preview';
import { MESSAGE_SCROLLER_DEMO_RTL } from '@generated/components/message-scroller/demo/rtl';
import { MESSAGE_SCROLLER_DEMO_STREAMING } from '@generated/components/message-scroller/demo/streaming';
import { MESSAGE_SCROLLER_DEMO_VIRTUALIZATION } from '@generated/components/message-scroller/demo/virtualization';
import { MESSAGE_SCROLLER_CLI_ADD } from '@generated/installation/cli/add-message-scroller';
import { MESSAGE_SCROLLER_MANUAL_CODE } from '@generated/installation/manual/message-scroller';
import { MESSAGE_SCROLLER_USAGE_CODE, MESSAGE_SCROLLER_USAGE_IMPORT } from '@generated/usage/message-scroller';

import { ZardDemoMessageScrollerJumpToMessageComponent } from './jump-to-message';
import { ZardDemoMessageScrollerLastAnchorComponent } from './last-anchor';
import { ZardDemoMessageScrollerLoadEarlierComponent } from './load-earlier';
import { ZardDemoMessageScrollerPreviewComponent } from './preview';
import { ZardDemoMessageScrollerRtlComponent } from './rtl';
import { ZardDemoMessageScrollerStreamingComponent } from './streaming';
import { ZardDemoMessageScrollerVirtualizationComponent } from './virtualization';
import { MESSAGE_SCROLLER_API } from '../doc/api';

export const MESSAGE_SCROLLER = {
  componentName: 'message-scroller',
  componentType: 'message-scroller',
  description:
    'A chat scroll container that opens at the right place, follows a streaming answer, keeps your place as history loads, and jumps to any message.',
  api: MESSAGE_SCROLLER_API,
  installData: {
    cliAdd: MESSAGE_SCROLLER_CLI_ADD,
    manualCode: MESSAGE_SCROLLER_MANUAL_CODE,
  },
  usage: { importBlock: MESSAGE_SCROLLER_USAGE_IMPORT, codeBlock: MESSAGE_SCROLLER_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoMessageScrollerPreviewComponent,
    codeData: MESSAGE_SCROLLER_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'streaming',
      description:
        "Set `zAutoScroll` to follow a streaming answer while the reader is at the live edge. Scroll up and it lets go; `[z-message-scroller-button]` appears, and clicking it scrolls back and resumes following. Mark the reader's own messages with `zAnchor` so each new turn settles near the top and the answer streams in below it.",
      component: ZardDemoMessageScrollerStreamingComponent,
      codeData: MESSAGE_SCROLLER_DEMO_STREAMING,
    },
    {
      name: 'load-earlier',
      description:
        'Prepending older rows does not move what the reader is looking at. `zPreserveScrollOnPrepend` is on by default; the "load earlier" row is just another `z-message-scroller-item`.',
      component: ZardDemoMessageScrollerLoadEarlierComponent,
      codeData: MESSAGE_SCROLLER_DEMO_LOAD_EARLIER,
    },
    {
      name: 'last-anchor',
      description:
        'Use `zDefaultPosition="last-anchor"` to reopen a saved thread at the last `zAnchor` row, with its reply right below, instead of at the very bottom. It falls back to `end` when that turn fits the viewport.',
      component: ZardDemoMessageScrollerLastAnchorComponent,
      codeData: MESSAGE_SCROLLER_DEMO_LAST_ANCHOR,
    },
    {
      name: 'jump-to-message',
      description:
        'Controls outside the transcript, such as search results or an outline, drive it through `ZardMessageScrollerService`. Read it from the scroller with `viewChild(ZardMessageScrollerComponent, { read: ZardMessageScrollerService })`, then call `scrollToMessage`. `visibleMessageIds` and `currentAnchorId` are signals.',
      component: ZardDemoMessageScrollerJumpToMessageComponent,
      codeData: MESSAGE_SCROLLER_DEMO_JUMP_TO_MESSAGE,
    },
    {
      name: 'virtualization',
      description:
        'Virtualization is a recipe, not an input. `z-message-scroller` renders real rows, which is what anchoring, prepend preservation and jump-to-message measure, and it stays fast well into the thousands of rows. When a transcript needs more, put the rows in a `cdk-virtual-scroll-viewport` with a fixed `itemSize` and let it own the scrolling, `scrollToIndex` standing in for `scrollToMessage`. You trade the scroller live-edge and anchoring behavior for it, so reach for it only when you have measured the need.',
      component: ZardDemoMessageScrollerVirtualizationComponent,
      codeData: MESSAGE_SCROLLER_DEMO_VIRTUALIZATION,
    },
    {
      name: 'rtl',
      description:
        'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). The scroll button stays centered and the rows mirror.',
      type: 'rtl' as const,
      component: ZardDemoMessageScrollerRtlComponent,
      codeData: MESSAGE_SCROLLER_DEMO_RTL,
    },
  ],
};
