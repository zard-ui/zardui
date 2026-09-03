import { SEPARATOR_DEMO_LIST } from '@generated/components/separator/demo/list';
import { SEPARATOR_DEMO_MENU } from '@generated/components/separator/demo/menu';
import { SEPARATOR_DEMO_PREVIEW } from '@generated/components/separator/demo/preview';
import { SEPARATOR_DEMO_VERTICAL } from '@generated/components/separator/demo/vertical';
import { SEPARATOR_CLI_ADD } from '@generated/installation/cli/add-separator';
import { SEPARATOR_MANUAL_CODE } from '@generated/installation/manual/separator';
import { SEPARATOR_USAGE_CODE, SEPARATOR_USAGE_IMPORT } from '@generated/usage/separator';

import { ZardDemoSeparatorListComponent } from './list';
import { ZardDemoSeparatorMenuComponent } from './menu';
import { ZardDemoSeparatorPreviewComponent } from './preview';
import { ZardDemoSeparatorVerticalComponent } from './vertical';
import { SEPARATOR_API } from '../doc/api';

export const SEPARATOR = {
  componentName: 'separator',
  componentType: 'separator',
  description: 'Visually or semantically separates content.',
  about: {
    description:
      'A separator is decorative by default (`zDecorative` is `true`), so it renders `role="none"` and stays out of the accessibility tree — right for a purely visual line. Set `[zDecorative]="false"` when the line marks a real boundary between sections instead: it then exposes `role="separator"` (plus `aria-orientation="vertical"` on a vertical one) so assistive tech announces it. `z-breadcrumb`, `z-dropdown-menu`, `z-context-menu`, `z-select`, `z-command`, `z-field`, `z-item`, `z-button-group` and `z-sidebar` ship their own purpose-built separator elements rather than composing `z-separator` — `z-separator` is the standalone one for arbitrary layouts.',
  },
  api: SEPARATOR_API,
  installData: {
    cliAdd: SEPARATOR_CLI_ADD,
    manualCode: SEPARATOR_MANUAL_CODE,
  },
  usage: { importBlock: SEPARATOR_USAGE_IMPORT, codeBlock: SEPARATOR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSeparatorPreviewComponent,
    codeData: SEPARATOR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'vertical',
      description:
        'A vertical `z-separator` relies on `self-stretch` to fill the cross axis of its flex container — give the row `items-center` (or an explicit height) so it has something to stretch to, or it collapses to zero height. This one is decorative (the `zDecorative` default), so it renders `role="none"` and is not announced.',
      component: ZardDemoSeparatorVerticalComponent,
      codeData: SEPARATOR_DEMO_VERTICAL,
    },
    {
      name: 'menu',
      description:
        'These separators mark real boundaries between menu sections, so `[zDecorative]="false"` gives them `role="separator"` and `aria-orientation="vertical"` instead of the default decorative `role="none"`.',
      component: ZardDemoSeparatorMenuComponent,
      codeData: SEPARATOR_DEMO_MENU,
    },
    {
      name: 'list',
      description:
        'Horizontal separators between list rows are meaningful dividers here too, not decoration, so `[zDecorative]="false"` exposes `role="separator"` to assistive tech.',
      component: ZardDemoSeparatorListComponent,
      codeData: SEPARATOR_DEMO_LIST,
    },
  ],
};
