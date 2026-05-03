import { INPUT_GROUP_DEMO_BLOCK_END } from '@generated/components/input-group/demo/block-end';
import { INPUT_GROUP_DEMO_BLOCK_START } from '@generated/components/input-group/demo/block-start';
import { INPUT_GROUP_DEMO_BUTTON } from '@generated/components/input-group/demo/button';
import { INPUT_GROUP_DEMO_CUSTOM } from '@generated/components/input-group/demo/custom';
import { INPUT_GROUP_DEMO_DEFAULT } from '@generated/components/input-group/demo/default';
import { INPUT_GROUP_DEMO_DROPDOWN } from '@generated/components/input-group/demo/dropdown';
import { INPUT_GROUP_DEMO_ICON } from '@generated/components/input-group/demo/icon';
import { INPUT_GROUP_DEMO_INLINE_END } from '@generated/components/input-group/demo/inline-end';
import { INPUT_GROUP_DEMO_INLINE_START } from '@generated/components/input-group/demo/inline-start';
import { INPUT_GROUP_DEMO_KBD } from '@generated/components/input-group/demo/kbd';
import { INPUT_GROUP_DEMO_SPINNER } from '@generated/components/input-group/demo/spinner';
import { INPUT_GROUP_DEMO_TEXT } from '@generated/components/input-group/demo/text';
import { INPUT_GROUP_DEMO_TEXTAREA } from '@generated/components/input-group/demo/textarea';
import { INPUT_GROUP_CLI_ADD } from '@generated/installation/cli/add-input-group';
import { INPUT_GROUP_MANUAL_CODE } from '@generated/installation/manual/input-group';
import { INPUT_GROUP_USAGE_CODE, INPUT_GROUP_USAGE_IMPORT } from '@generated/usage/input-group';

import { ZardDemoInputGroupBlockEndComponent } from './block-end';
import { ZardDemoInputGroupBlockStartComponent } from './block-start';
import { ZardDemoInputGroupButtonComponent } from './button';
import { ZardDemoInputGroupCustomComponent } from './custom';
import { ZardDemoInputGroupDefaultComponent } from './default';
import { ZardDemoInputGroupDropdownComponent } from './dropdown';
import { ZardDemoInputGroupIconComponent } from './icon';
import { ZardDemoInputGroupInlineEndComponent } from './inline-end';
import { ZardDemoInputGroupInlineStartComponent } from './inline-start';
import { ZardDemoInputGroupKbdComponent } from './kbd';
import { ZardDemoInputGroupSpinnerComponent } from './spinner';
import { ZardDemoInputGroupTextComponent } from './text';
import { ZardDemoInputGroupTextareaComponent } from './textarea';
import { INPUT_GROUP_API } from '../doc/api';

export const INPUT_GROUP = {
  componentName: 'input-group',
  componentType: 'input-group',
  description: 'Add addons, buttons, and helper content to inputs.',
  api: INPUT_GROUP_API,
  installData: {
    cliAdd: INPUT_GROUP_CLI_ADD,
    manualCode: INPUT_GROUP_MANUAL_CODE,
  },
  usage: { importBlock: INPUT_GROUP_USAGE_IMPORT, codeBlock: INPUT_GROUP_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoInputGroupDefaultComponent,
    column: false,
    codeData: INPUT_GROUP_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'inline-start',
      description: 'Use zAlign="inline-start" to position the addon at the start of the input. This is the default.',
      component: ZardDemoInputGroupInlineStartComponent,
      codeData: INPUT_GROUP_DEMO_INLINE_START,
    },
    {
      name: 'inline-end',
      description: 'Use zAlign="inline-end" to position the addon at the end of the input.',
      component: ZardDemoInputGroupInlineEndComponent,
      codeData: INPUT_GROUP_DEMO_INLINE_END,
    },
    {
      name: 'block-start',
      description: 'Use zAlign="block-start" to position the addon above the input.',
      component: ZardDemoInputGroupBlockStartComponent,
      codeData: INPUT_GROUP_DEMO_BLOCK_START,
    },
    {
      name: 'block-end',
      description: 'Use zAlign="block-end" to position the addon below the input.',
      component: ZardDemoInputGroupBlockEndComponent,
      codeData: INPUT_GROUP_DEMO_BLOCK_END,
    },
    {
      name: 'icon',
      component: ZardDemoInputGroupIconComponent,
      codeData: INPUT_GROUP_DEMO_ICON,
    },
    {
      name: 'text',
      component: ZardDemoInputGroupTextComponent,
      codeData: INPUT_GROUP_DEMO_TEXT,
    },
    {
      name: 'button',
      component: ZardDemoInputGroupButtonComponent,
      codeData: INPUT_GROUP_DEMO_BUTTON,
    },
    {
      name: 'kbd',
      component: ZardDemoInputGroupKbdComponent,
      codeData: INPUT_GROUP_DEMO_KBD,
    },
    {
      name: 'dropdown',
      component: ZardDemoInputGroupDropdownComponent,
      codeData: INPUT_GROUP_DEMO_DROPDOWN,
    },
    {
      name: 'spinner',
      component: ZardDemoInputGroupSpinnerComponent,
      codeData: INPUT_GROUP_DEMO_SPINNER,
    },
    {
      name: 'textarea',
      component: ZardDemoInputGroupTextareaComponent,
      codeData: INPUT_GROUP_DEMO_TEXTAREA,
    },
    {
      name: 'custom',
      description:
        'Add the data-slot="input-group-control" attribute to your custom input for automatic focus state handling.',
      component: ZardDemoInputGroupCustomComponent,
      codeData: INPUT_GROUP_DEMO_CUSTOM,
    },
  ],
};
