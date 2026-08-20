import { MESSAGE_DEMO_ACTIONS } from '@generated/components/message/demo/actions';
import { MESSAGE_DEMO_ATTACHMENT } from '@generated/components/message/demo/attachment';
import { MESSAGE_DEMO_AVATAR } from '@generated/components/message/demo/avatar';
import { MESSAGE_DEMO_DEFAULT } from '@generated/components/message/demo/default';
import { MESSAGE_DEMO_GROUP } from '@generated/components/message/demo/group';
import { MESSAGE_DEMO_HEADER_FOOTER } from '@generated/components/message/demo/header-footer';
import { MESSAGE_CLI_ADD } from '@generated/installation/cli/add-message';
import { MESSAGE_MANUAL_CODE } from '@generated/installation/manual/message';
import { MESSAGE_USAGE_CODE, MESSAGE_USAGE_IMPORT } from '@generated/usage/message';

import { ZardDemoMessageActionsComponent } from './actions';
import { ZardDemoMessageAttachmentComponent } from './attachment';
import { ZardDemoMessageAvatarComponent } from './avatar';
import { ZardDemoMessageDefaultComponent } from './default';
import { ZardDemoMessageGroupComponent } from './group';
import { ZardDemoMessageHeaderFooterComponent } from './header-footer';
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
  examples: [
    { name: 'default', component: ZardDemoMessageDefaultComponent, codeData: MESSAGE_DEMO_DEFAULT },
    { name: 'avatar', component: ZardDemoMessageAvatarComponent, codeData: MESSAGE_DEMO_AVATAR },
    { name: 'group', component: ZardDemoMessageGroupComponent, codeData: MESSAGE_DEMO_GROUP },
    {
      name: 'header-footer',
      component: ZardDemoMessageHeaderFooterComponent,
      codeData: MESSAGE_DEMO_HEADER_FOOTER,
    },
    { name: 'actions', component: ZardDemoMessageActionsComponent, codeData: MESSAGE_DEMO_ACTIONS },
    { name: 'attachment', component: ZardDemoMessageAttachmentComponent, codeData: MESSAGE_DEMO_ATTACHMENT },
  ],
};
