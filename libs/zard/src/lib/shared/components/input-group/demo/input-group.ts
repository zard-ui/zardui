import { INPUT_GROUP_DEMO_BLOCK_END } from '@generated/components/input-group/demo/block-end';
import { INPUT_GROUP_DEMO_BLOCK_START } from '@generated/components/input-group/demo/block-start';
import { INPUT_GROUP_DEMO_BUTTON } from '@generated/components/input-group/demo/button';
import { INPUT_GROUP_DEMO_CUSTOM_INPUT } from '@generated/components/input-group/demo/custom-input';
import { INPUT_GROUP_DEMO_DROPDOWN } from '@generated/components/input-group/demo/dropdown';
import { INPUT_GROUP_DEMO_ICON } from '@generated/components/input-group/demo/icon';
import { INPUT_GROUP_DEMO_INLINE_END } from '@generated/components/input-group/demo/inline-end';
import { INPUT_GROUP_DEMO_INLINE_START } from '@generated/components/input-group/demo/inline-start';
import { INPUT_GROUP_DEMO_KBD } from '@generated/components/input-group/demo/kbd';
import { INPUT_GROUP_DEMO_PREVIEW } from '@generated/components/input-group/demo/preview';
import { INPUT_GROUP_DEMO_SPINNER } from '@generated/components/input-group/demo/spinner';
import { INPUT_GROUP_DEMO_TEXT } from '@generated/components/input-group/demo/text';
import { INPUT_GROUP_DEMO_TEXTAREA } from '@generated/components/input-group/demo/textarea';
import { INPUT_GROUP_CLI_ADD } from '@generated/installation/cli/add-input-group';
import { INPUT_GROUP_MANUAL_CODE } from '@generated/installation/manual/input-group';
import { INPUT_GROUP_USAGE_CODE, INPUT_GROUP_USAGE_IMPORT } from '@generated/usage/input-group';

import { ZardDemoInputGroupBlockEndComponent } from './block-end';
import { ZardDemoInputGroupBlockStartComponent } from './block-start';
import { ZardDemoInputGroupButtonComponent } from './button';
import { ZardDemoInputGroupCustomInputComponent } from './custom-input';
import { ZardDemoInputGroupDropdownComponent } from './dropdown';
import { ZardDemoInputGroupIconComponent } from './icon';
import { ZardDemoInputGroupInlineEndComponent } from './inline-end';
import { ZardDemoInputGroupInlineStartComponent } from './inline-start';
import { ZardDemoInputGroupKbdComponent } from './kbd';
import { ZardDemoInputGroupPreviewComponent } from './preview';
import { ZardDemoInputGroupSpinnerComponent } from './spinner';
import { ZardDemoInputGroupTextComponent } from './text';
import { ZardDemoInputGroupTextareaComponent } from './textarea';
import { INPUT_GROUP_API } from '../doc/api';

export const INPUT_GROUP = {
  componentName: 'input-group',
  componentType: 'input-group',
  description: 'Add addons, buttons, and helper content to inputs.',
  about: {
    description:
      "`z-input-group` wraps `input[z-input]` or `textarea[z-textarea]` together with one or more `z-input-group-addon` slots holding an icon, `z-input-group-text`, `button[z-input-group-button]`, `z-kbd` or `z-spinner`. Each addon's `zAlign` places it `inline-start` (default), `inline-end`, `block-start` or `block-end` relative to the control, and the whole group shares one focus ring and one `aria-invalid` state. Use `z-input-group` when the extra content is anchored to a single field; reach for `z-button-group` instead for a standalone row of buttons or controls that is not attached to a field.",
  },
  api: INPUT_GROUP_API,
  installData: {
    cliAdd: INPUT_GROUP_CLI_ADD,
    manualCode: INPUT_GROUP_MANUAL_CODE,
  },
  usage: { importBlock: INPUT_GROUP_USAGE_IMPORT, codeBlock: INPUT_GROUP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoInputGroupPreviewComponent,
    column: false,
    codeData: INPUT_GROUP_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'inline-start',
      description: 'Use `zAlign="inline-start"` to position the addon at the start of the input. This is the default.',
      component: ZardDemoInputGroupInlineStartComponent,
      codeData: INPUT_GROUP_DEMO_INLINE_START,
    },
    {
      name: 'inline-end',
      description: 'Use `zAlign="inline-end"` to position the addon at the end of the input.',
      component: ZardDemoInputGroupInlineEndComponent,
      codeData: INPUT_GROUP_DEMO_INLINE_END,
    },
    {
      name: 'block-start',
      description: 'Use `zAlign="block-start"` to position the addon above the input or textarea.',
      component: ZardDemoInputGroupBlockStartComponent,
      codeData: INPUT_GROUP_DEMO_BLOCK_START,
    },
    {
      name: 'block-end',
      description: 'Use `zAlign="block-end"` to position the addon below the input or textarea.',
      component: ZardDemoInputGroupBlockEndComponent,
      codeData: INPUT_GROUP_DEMO_BLOCK_END,
    },
    {
      name: 'icon',
      description:
        'Place an `<ng-icon>` inside `z-input-group-addon` for a decorative icon. Add one at `inline-start` and one at `inline-end` to bracket the input, or two icons in the same addon.',
      component: ZardDemoInputGroupIconComponent,
      codeData: INPUT_GROUP_DEMO_ICON,
    },
    {
      name: 'text',
      description:
        'Use `z-input-group-text` inside `z-input-group-addon` for a static text affix — a currency symbol, a domain, a unit — on either side of an `input[z-input]` or below a `textarea[z-textarea]`.',
      component: ZardDemoInputGroupTextComponent,
      codeData: INPUT_GROUP_DEMO_TEXT,
    },
    {
      name: 'button',
      description:
        'Put a `button[z-input-group-button]` inside `z-input-group-addon` for an action attached to the input. `zSize="icon-xs"` fits an icon-only button and `zVariant="secondary"` gives it more visual weight than the `ghost` default.',
      component: ZardDemoInputGroupButtonComponent,
      codeData: INPUT_GROUP_DEMO_BUTTON,
    },
    {
      name: 'kbd',
      description: 'Add a `z-kbd` inside `z-input-group-addon` to show a keyboard shortcut hint next to the input.',
      component: ZardDemoInputGroupKbdComponent,
      codeData: INPUT_GROUP_DEMO_KBD,
    },
    {
      name: 'dropdown',
      description:
        'Compose `[z-dropdown]` on a `button[z-input-group-button]` inside `z-input-group-addon` to open a `z-dropdown-menu-content` from the group.',
      component: ZardDemoInputGroupDropdownComponent,
      codeData: INPUT_GROUP_DEMO_DROPDOWN,
    },
    {
      name: 'spinner',
      description:
        'Add a `z-spinner` inside `z-input-group-addon` to show a busy state next to the input; pair it with `z-input-group-text` for a status label.',
      component: ZardDemoInputGroupSpinnerComponent,
      codeData: INPUT_GROUP_DEMO_SPINNER,
    },
    {
      name: 'textarea',
      description:
        'Wrap `textarea[z-textarea]` in `z-input-group` and use `zAlign="block-start"`/`zAlign="block-end"` addons to attach a toolbar above or below it.',
      component: ZardDemoInputGroupTextareaComponent,
      codeData: INPUT_GROUP_DEMO_TEXTAREA,
    },
    {
      name: 'custom-input',
      description:
        'Add the `data-slot="input-group-control"` attribute to your own control to opt it into the group\'s styling and focus-state handling without using `input[z-input]`.',
      component: ZardDemoInputGroupCustomInputComponent,
      codeData: INPUT_GROUP_DEMO_CUSTOM_INPUT,
    },
  ],
};
