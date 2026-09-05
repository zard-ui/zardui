import { MESSAGE_DEMO_ACTIONS } from '@generated/components/message/demo/actions';
import { MESSAGE_DEMO_ATTACHMENT } from '@generated/components/message/demo/attachment';
import { MESSAGE_DEMO_AVATAR } from '@generated/components/message/demo/avatar';
import { MESSAGE_DEMO_GROUP } from '@generated/components/message/demo/group';
import { MESSAGE_DEMO_HEADER_AND_FOOTER } from '@generated/components/message/demo/header-and-footer';
import { MESSAGE_DEMO_PREVIEW } from '@generated/components/message/demo/preview';
import { MESSAGE_DEMO_SHORTHAND } from '@generated/components/message/demo/shorthand';
import { MESSAGE_CLI_ADD } from '@generated/installation/cli/add-message';
import { MESSAGE_MANUAL_CODE } from '@generated/installation/manual/message';
import { MESSAGE_USAGE_CODE, MESSAGE_USAGE_IMPORT } from '@generated/usage/message';

import { ZardDemoMessageActionsComponent } from './actions';
import { ZardDemoMessageAttachmentComponent } from './attachment';
import { ZardDemoMessageAvatarComponent } from './avatar';
import { ZardDemoMessageGroupComponent } from './group';
import { ZardDemoMessageHeaderAndFooterComponent } from './header-and-footer';
import { ZardDemoMessagePreviewComponent } from './preview';
import { ZardDemoMessageShorthandComponent } from './shorthand';
import { MESSAGE_API } from '../doc/api';

export const MESSAGE = {
  componentName: 'message',
  componentType: 'message',
  description: 'Displays a message in a conversation, with optional avatar, header, footer, and alignment.',
  api: MESSAGE_API,
  installData: {
    cliAdd: MESSAGE_CLI_ADD,
    manualCode: MESSAGE_MANUAL_CODE,
  },
  usage: { importBlock: MESSAGE_USAGE_IMPORT, codeBlock: MESSAGE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoMessagePreviewComponent,
    codeData: MESSAGE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'avatar',
      description:
        'Project a real `z-avatar` into `z-message-avatar` to render an avatar next to the turn. Set `zAlign="end"` on `z-message` to align the avatar, and the bubble it sits beside, to the end of the row.',
      component: ZardDemoMessageAvatarComponent,
      codeData: MESSAGE_DEMO_AVATAR,
    },
    {
      name: 'group',
      description:
        'Wrap consecutive `z-message` elements from the same sender in `z-message-group` to stack them tightly. Leave `z-message-avatar` empty on the earlier turns — it reserves the same width as the real avatar on the last one, so the group stays aligned.',
      component: ZardDemoMessageGroupComponent,
      codeData: MESSAGE_DEMO_GROUP,
    },
    {
      name: 'header-and-footer',
      description:
        "Project `z-message-header` for a sender name and `z-message-footer` for metadata such as a delivery or read status. The footer follows the message's `zAlign` side, so it stays right-aligned on a sent turn.",
      component: ZardDemoMessageHeaderAndFooterComponent,
      codeData: MESSAGE_DEMO_HEADER_AND_FOOTER,
    },
    {
      name: 'actions',
      description:
        'Place message-level actions — copy, retry, like or dislike — inside `z-message-footer` as real `z-button`s. Give each icon-only button an `aria-label`, since the footer holds no visible text for it.',
      component: ZardDemoMessageActionsComponent,
      codeData: MESSAGE_DEMO_ACTIONS,
    },
    {
      name: 'attachment',
      description:
        'Project a real `z-item` next to the bubble inside `z-message-content` to attach media or a document to a turn — `zVariant="image"` for a photo, `zVariant="icon"` for a file — placed before or after the bubble depending on reading order.',
      component: ZardDemoMessageAttachmentComponent,
      codeData: MESSAGE_DEMO_ATTACHMENT,
    },
    {
      name: 'shorthand',
      description:
        'A zard-only shorthand: a `z-message` with no projected `z-message-content` builds the avatar, bubble and header/footer itself from `zSrc`/`zFallback`, `zVariant`, `zHeader` and `zFooter`, so a plain turn is one tag. Project the explicit `z-message-content` (with `z-message-header`/`z-message-footer` around a `z-bubble`) when the turn needs a custom composition.',
      component: ZardDemoMessageShorthandComponent,
      codeData: MESSAGE_DEMO_SHORTHAND,
    },
  ],
};
