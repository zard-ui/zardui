import { ATTACHMENT_DEMO_DEFAULT } from '@generated/components/attachment/demo/default';
import { ATTACHMENT_DEMO_GROUP } from '@generated/components/attachment/demo/group';
import { ATTACHMENT_DEMO_IMAGE } from '@generated/components/attachment/demo/image';
import { ATTACHMENT_DEMO_SIZES } from '@generated/components/attachment/demo/sizes';
import { ATTACHMENT_DEMO_STATES } from '@generated/components/attachment/demo/states';
import { ATTACHMENT_DEMO_TRIGGER } from '@generated/components/attachment/demo/trigger';
import { ATTACHMENT_CLI_ADD } from '@generated/installation/cli/add-attachment';
import { ATTACHMENT_MANUAL_CODE } from '@generated/installation/manual/attachment';
import { ATTACHMENT_USAGE_CODE, ATTACHMENT_USAGE_IMPORT } from '@generated/usage/attachment';

import { ZardDemoAttachmentDefaultComponent } from './default';
import { ZardDemoAttachmentGroupComponent } from './group';
import { ZardDemoAttachmentImageComponent } from './image';
import { ZardDemoAttachmentSizesComponent } from './sizes';
import { ZardDemoAttachmentStatesComponent } from './states';
import { ZardDemoAttachmentTriggerComponent } from './trigger';
import { ATTACHMENT_API } from '../doc/api';

export const ATTACHMENT = {
  componentName: 'attachment',
  componentType: 'attachment',
  description: 'Composable file and image attachment',
  api: ATTACHMENT_API,
  installData: {
    cliAdd: ATTACHMENT_CLI_ADD,
    manualCode: ATTACHMENT_MANUAL_CODE,
  },
  usage: { importBlock: ATTACHMENT_USAGE_IMPORT, codeBlock: ATTACHMENT_USAGE_CODE },
  examples: [
    { name: 'default', component: ZardDemoAttachmentDefaultComponent, codeData: ATTACHMENT_DEMO_DEFAULT },
    { name: 'image', component: ZardDemoAttachmentImageComponent, codeData: ATTACHMENT_DEMO_IMAGE },
    { name: 'states', component: ZardDemoAttachmentStatesComponent, codeData: ATTACHMENT_DEMO_STATES },
    { name: 'sizes', component: ZardDemoAttachmentSizesComponent, codeData: ATTACHMENT_DEMO_SIZES },
    { name: 'group', component: ZardDemoAttachmentGroupComponent, codeData: ATTACHMENT_DEMO_GROUP },
    { name: 'trigger', component: ZardDemoAttachmentTriggerComponent, codeData: ATTACHMENT_DEMO_TRIGGER },
  ],
};
