import { ITEM_DEMO_AVATAR } from '@generated/components/item/demo/avatar';
import { ITEM_DEMO_DEFAULT } from '@generated/components/item/demo/default';
import { ITEM_DEMO_DROPDOWN } from '@generated/components/item/demo/dropdown';
import { ITEM_DEMO_GROUP } from '@generated/components/item/demo/group';
import { ITEM_DEMO_HEADER } from '@generated/components/item/demo/header';
import { ITEM_DEMO_ICON } from '@generated/components/item/demo/icon';
import { ITEM_DEMO_IMAGE } from '@generated/components/item/demo/image';
import { ITEM_DEMO_LINK } from '@generated/components/item/demo/link';
import { ITEM_DEMO_SIZE } from '@generated/components/item/demo/size';
import { ITEM_DEMO_VARIANT } from '@generated/components/item/demo/variant';
import { ITEM_CLI_ADD } from '@generated/installation/cli/add-item';
import { ITEM_MANUAL_CODE } from '@generated/installation/manual/item';
import { ITEM_USAGE_CODE, ITEM_USAGE_IMPORT } from '@generated/usage/item';

import { ZardDemoItemAvatarComponent } from './avatar';
import { ZardDemoItemDefaultComponent } from './default';
import { ZardDemoItemDropdownComponent } from './dropdown';
import { ZardDemoItemGroupComponent } from './group';
import { ZardDemoItemHeaderComponent } from './header';
import { ZardDemoItemIconComponent } from './icon';
import { ZardDemoItemImageComponent } from './image';
import { ZardDemoItemLinkComponent } from './link';
import { ZardDemoItemSizeComponent } from './size';
import { ZardDemoItemVariantComponent } from './variant';
import { ITEM_API } from '../doc/api';

export const ITEM = {
  componentName: 'item',
  componentType: 'item',
  description: 'A versatile component for displaying content with media, title, description, and actions.',
  api: ITEM_API,
  installData: {
    cliAdd: ITEM_CLI_ADD,
    manualCode: ITEM_MANUAL_CODE,
  },
  usage: { importBlock: ITEM_USAGE_IMPORT, codeBlock: ITEM_USAGE_CODE },
  examples: [
    { name: 'default', component: ZardDemoItemDefaultComponent, codeData: ITEM_DEMO_DEFAULT },
    { name: 'variant', component: ZardDemoItemVariantComponent, codeData: ITEM_DEMO_VARIANT },
    { name: 'size', component: ZardDemoItemSizeComponent, codeData: ITEM_DEMO_SIZE },
    { name: 'icon', component: ZardDemoItemIconComponent, codeData: ITEM_DEMO_ICON },
    { name: 'avatar', component: ZardDemoItemAvatarComponent, codeData: ITEM_DEMO_AVATAR },
    { name: 'image', component: ZardDemoItemImageComponent, codeData: ITEM_DEMO_IMAGE },
    { name: 'group', component: ZardDemoItemGroupComponent, codeData: ITEM_DEMO_GROUP },
    { name: 'header', component: ZardDemoItemHeaderComponent, codeData: ITEM_DEMO_HEADER },
    { name: 'link', component: ZardDemoItemLinkComponent, codeData: ITEM_DEMO_LINK },
    { name: 'dropdown', component: ZardDemoItemDropdownComponent, codeData: ITEM_DEMO_DROPDOWN },
  ],
};
