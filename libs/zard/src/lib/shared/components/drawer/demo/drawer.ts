import { DRAWER_DEMO_BASIC } from '@generated/components/drawer/demo/basic';
import { DRAWER_DEMO_CUSTOM_SIZES } from '@generated/components/drawer/demo/custom-sizes';
import { DRAWER_DEMO_NESTED } from '@generated/components/drawer/demo/nested';
import { DRAWER_DEMO_NON_MODAL } from '@generated/components/drawer/demo/non-modal';
import { DRAWER_DEMO_POSITION } from '@generated/components/drawer/demo/position';
import { DRAWER_DEMO_RESPONSIVE } from '@generated/components/drawer/demo/responsive';
import { DRAWER_DEMO_SERVICE } from '@generated/components/drawer/demo/service';
import { DRAWER_DEMO_SNAP_POINTS } from '@generated/components/drawer/demo/snap-points';
import { DRAWER_DEMO_SWIPE_HANDLE } from '@generated/components/drawer/demo/swipe-handle';
import { DRAWER_CLI_ADD } from '@generated/installation/cli/add-drawer';
import { DRAWER_MANUAL_CODE } from '@generated/installation/manual/drawer';
import { DRAWER_USAGE_CODE, DRAWER_USAGE_IMPORT } from '@generated/usage/drawer';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoDrawerBasicComponent } from './basic';
import { ZardDemoDrawerCustomSizesComponent } from './custom-sizes';
import { ZardDemoDrawerNestedComponent } from './nested';
import { ZardDemoDrawerNonModalComponent } from './non-modal';
import { ZardDemoDrawerPositionComponent } from './position';
import { ZardDemoDrawerResponsiveComponent } from './responsive';
import { ZardDemoDrawerServiceComponent } from './service';
import { ZardDemoDrawerSnapPointsComponent } from './snap-points';
import { ZardDemoDrawerSwipeHandleComponent } from './swipe-handle';
import { DRAWER_API } from '../doc/api';

const DRAWER_COMPOSITION_CODE = `z-drawer
├── z-drawer-header
│   ├── z-drawer-title
│   └── z-drawer-description
├── (your content)
└── z-drawer-footer
    └── [z-drawer-close]`;

const escapeCompositionHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DRAWER_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${DRAWER_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: DRAWER_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const DRAWER = {
  componentName: 'drawer',
  componentType: 'drawer',
  description: 'A draggable panel that slides in from an edge of the screen.',
  api: DRAWER_API,
  installData: {
    cliAdd: DRAWER_CLI_ADD,
    manualCode: DRAWER_MANUAL_CODE,
  },
  usage: { importBlock: DRAWER_USAGE_IMPORT, codeBlock: DRAWER_USAGE_CODE },
  composition: DRAWER_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoDrawerBasicComponent,
    codeData: DRAWER_DEMO_BASIC,
    column: false,
  },
  examples: [
    {
      name: 'custom-sizes',
      description:
        'A vertical drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)`. A side drawer spans 75% of the viewport width, or `24rem` on larger screens. Override either with `class`.',
      component: ZardDemoDrawerCustomSizesComponent,
      codeData: DRAWER_DEMO_CUSTOM_SIZES,
    },
    {
      name: 'position',
      description: 'Use `zPlacement` to set the side of the drawer. Values are `top`, `right`, `bottom` and `left`.',
      component: ZardDemoDrawerPositionComponent,
      codeData: DRAWER_DEMO_POSITION,
    },
    {
      name: 'swipe-handle',
      description: 'Use `zHandle` to render a swipe handle.',
      component: ZardDemoDrawerSwipeHandleComponent,
      codeData: DRAWER_DEMO_SWIPE_HANDLE,
    },
    {
      name: 'nested',
      description:
        'Open drawers from inside another drawer. Parent drawers stay mounted and stack behind the frontmost drawer.',
      component: ZardDemoDrawerNestedComponent,
      codeData: DRAWER_DEMO_NESTED,
    },
    {
      name: 'non-modal',
      description:
        'Set `[zModal]="false"` to allow interaction with the rest of the page while the drawer is open. A non-modal drawer keeps no mask, so an outside press does not dismiss it.',
      component: ZardDemoDrawerNonModalComponent,
      codeData: DRAWER_DEMO_NON_MODAL,
    },
    {
      name: 'snap-points',
      description:
        'Use `zSnapPoints` to snap a drawer to preset heights. Numbers between `0` and `1` represent fractions of the viewport. Numbers greater than `1` are treated as pixel values. String values support `px` and `rem` units. Snap points apply to vertical drawers. Track the active one with `[(zSnapPoint)]`; at the largest snap point the drawer gets a `data-expanded` attribute you can style against.',
      component: ZardDemoDrawerSnapPointsComponent,
      codeData: DRAWER_DEMO_SNAP_POINTS,
    },
    {
      name: 'responsive',
      description:
        'You can combine the Dialog and Drawer components to create a responsive dialog. This renders a Dialog on desktop and a Drawer on mobile.',
      component: ZardDemoDrawerResponsiveComponent,
      codeData: DRAWER_DEMO_RESPONSIVE,
    },
    {
      name: 'service',
      description: 'Use `ZardDrawerService.create()` when the drawer is opened from code instead of from a template.',
      component: ZardDemoDrawerServiceComponent,
      codeData: DRAWER_DEMO_SERVICE,
    },
  ],
};
