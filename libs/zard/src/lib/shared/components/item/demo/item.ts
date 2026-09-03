import { ITEM_DEMO_AVATAR } from '@generated/components/item/demo/avatar';
import { ITEM_DEMO_DROPDOWN } from '@generated/components/item/demo/dropdown';
import { ITEM_DEMO_GROUP } from '@generated/components/item/demo/group';
import { ITEM_DEMO_HEADER } from '@generated/components/item/demo/header';
import { ITEM_DEMO_ICON } from '@generated/components/item/demo/icon';
import { ITEM_DEMO_IMAGE } from '@generated/components/item/demo/image';
import { ITEM_DEMO_LINK } from '@generated/components/item/demo/link';
import { ITEM_DEMO_PREVIEW } from '@generated/components/item/demo/preview';
import { ITEM_DEMO_SIZE } from '@generated/components/item/demo/size';
import { ITEM_DEMO_VARIANT } from '@generated/components/item/demo/variant';
import { ITEM_CLI_ADD } from '@generated/installation/cli/add-item';
import { ITEM_MANUAL_CODE } from '@generated/installation/manual/item';
import { ITEM_USAGE_CODE, ITEM_USAGE_IMPORT } from '@generated/usage/item';

import { ZardDemoItemAvatarComponent } from './avatar';
import { ZardDemoItemDropdownComponent } from './dropdown';
import { ZardDemoItemGroupComponent } from './group';
import { ZardDemoItemHeaderComponent } from './header';
import { ZardDemoItemIconComponent } from './icon';
import { ZardDemoItemImageComponent } from './image';
import { ZardDemoItemLinkComponent } from './link';
import { ZardDemoItemPreviewComponent } from './preview';
import { ZardDemoItemSizeComponent } from './size';
import { ZardDemoItemVariantComponent } from './variant';
import { ITEM_API } from '../doc/api';

export const ITEM = {
  componentName: 'item',
  componentType: 'item',
  description: 'A versatile component for displaying content with media, title, description, and actions.',
  api: ITEM_API,
  about: {
    title: 'Composing an item',
    description:
      '`z-item` is a row with optional media, a title/description pair, and trailing actions, shaped by three independent scales. On the container, `zVariant` picks the surface (`default` transparent, `outline` bordered, `muted` a tinted background) and `zSize` picks the density (`default` and `sm` share the same padding, `xs` tightens it for compact contexts such as a dropdown menu). On `z-item-media`, its own `zVariant` (`default`, `icon`, `image`) styles whatever is projected into it — `icon` sizes an `ng-icon`, `image` clips an `<img>` to a fixed square that scales with the container\'s `zSize`; there is no dedicated `avatar` media variant, so project a real `z-avatar` / `z-avatar-group` into the `default` variant and size it with a `class` instead. Compose a list with `z-item-group` (`role="list"`) and `z-item-separator` between rows; a single item\'s `z-item-header` / `z-item-footer` add a full-width row above or below `z-item-content` (which wraps `z-item-title` and `z-item-description`), and `z-item-actions` holds trailing controls. Render the whole row as `a[z-item]` — with `[routerLink]` for in-app navigation or a plain `href` for an external destination — to make it a real link rather than a styled div.',
  },
  installData: {
    cliAdd: ITEM_CLI_ADD,
    manualCode: ITEM_MANUAL_CODE,
  },
  usage: { importBlock: ITEM_USAGE_IMPORT, codeBlock: ITEM_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoItemPreviewComponent,
    codeData: ITEM_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'variant',
      description:
        'zVariant on z-item switches the container surface between default (transparent), outline (a visible border) and muted (a tinted background); every row here also sets z-item-media\'s zVariant to "icon".',
      component: ZardDemoItemVariantComponent,
      codeData: ITEM_DEMO_VARIANT,
    },
    {
      name: 'size',
      description:
        'zSize on z-item sets the density: default and sm share the same padding, xs switches to the compact scale used inside menus and tightens the gap between title and description.',
      component: ZardDemoItemSizeComponent,
      codeData: ITEM_DEMO_SIZE,
    },
    {
      name: 'icon',
      description:
        'z-item-media\'s own zVariant switches between default, icon and image treatments; set to "icon" here, it sizes and aligns a projected ng-icon at the leading edge of the item.',
      component: ZardDemoItemIconComponent,
      codeData: ITEM_DEMO_ICON,
    },
    {
      name: 'avatar',
      description:
        "There is no dedicated avatar media variant — project a real z-avatar or z-avatar-group into z-item-media's default variant and size it directly with a class on the avatar.",
      component: ZardDemoItemAvatarComponent,
      codeData: ITEM_DEMO_AVATAR,
    },
    {
      name: 'image',
      description:
        'z-item-media\'s zVariant="image" clips a projected image (NgOptimizedImage here) to a fixed square that scales with the item\'s zSize.',
      component: ZardDemoItemImageComponent,
      codeData: ITEM_DEMO_IMAGE,
    },
    {
      name: 'group',
      description: 'z-item-group (role="list") wraps several z-item rows and applies consistent spacing between them.',
      component: ZardDemoItemGroupComponent,
      codeData: ITEM_DEMO_GROUP,
    },
    {
      name: 'header',
      description:
        'z-item-header renders a full-width row above z-item-content and z-item-footer renders the matching row below it — shown here with an image header and a price/action footer.',
      component: ZardDemoItemHeaderComponent,
      codeData: ITEM_DEMO_HEADER,
    },
    {
      name: 'link',
      description:
        'Render the item as a real anchor with a[z-item]: bind [routerLink] for in-app navigation through the Angular Router, or pass a plain href with target/rel for an external destination.',
      component: ZardDemoItemLinkComponent,
      codeData: ITEM_DEMO_LINK,
    },
    {
      name: 'dropdown',
      description:
        'Compose z-item at zSize="xs" (the compact scale) inside a real z-dropdown-menu-item to give each menu option its own media/content row.',
      component: ZardDemoItemDropdownComponent,
      codeData: ITEM_DEMO_DROPDOWN,
    },
  ],
};
