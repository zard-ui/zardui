import { SKELETON_DEMO_AVATAR } from '@generated/components/skeleton/demo/avatar';
import { SKELETON_DEMO_CARD } from '@generated/components/skeleton/demo/card';
import { SKELETON_DEMO_FORM } from '@generated/components/skeleton/demo/form';
import { SKELETON_DEMO_PREVIEW } from '@generated/components/skeleton/demo/preview';
import { SKELETON_DEMO_TABLE } from '@generated/components/skeleton/demo/table';
import { SKELETON_DEMO_TEXT } from '@generated/components/skeleton/demo/text';
import { SKELETON_CLI_ADD } from '@generated/installation/cli/add-skeleton';
import { SKELETON_MANUAL_CODE } from '@generated/installation/manual/skeleton';
import { SKELETON_USAGE_CODE, SKELETON_USAGE_IMPORT } from '@generated/usage/skeleton';

import { ZardDemoSkeletonAvatarComponent } from './avatar';
import { ZardDemoSkeletonCardComponent } from './card';
import { ZardDemoSkeletonFormComponent } from './form';
import { ZardDemoSkeletonPreviewComponent } from './preview';
import { ZardDemoSkeletonTableComponent } from './table';
import { ZardDemoSkeletonTextComponent } from './text';
import { SKELETON_API } from '../doc/api';

export const SKELETON = {
  componentName: 'skeleton',
  componentType: 'skeleton',
  api: SKELETON_API,
  description: 'Use to show a placeholder while content is loading.',
  fullWidth: true,
  about: {
    description:
      'A skeleton has no shape of its own — compose one `z-skeleton` per piece of content it stands in for (a circle for `z-avatar`, a bar the height of a text line, `h-8` to match `z-input`/`z-button`), laid out the way the loaded content will be. The pulse is Tailwind\'s `animate-pulse`, and it keeps animating under `prefers-reduced-motion: reduce` since the component sets no `motion-reduce:animate-none` override — a real, verified gap, not a hypothetical one. The host carries `aria-hidden="true"`, so every `z-skeleton` is skipped by assistive tech entirely rather than announced as a loading region. `z-sidebar-menu-skeleton` follows the same compose-with-`z-skeleton` convention for its icon and text bars.',
  },
  installData: {
    cliAdd: SKELETON_CLI_ADD,
    manualCode: SKELETON_MANUAL_CODE,
  },
  usage: { importBlock: SKELETON_USAGE_IMPORT, codeBlock: SKELETON_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoSkeletonPreviewComponent,
    column: false,
    codeData: SKELETON_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'avatar',
      description:
        'A compact avatar label: a `size-10` circle standing in for `z-avatar` next to two short bars for a name and a secondary line.',
      component: ZardDemoSkeletonAvatarComponent,
      codeData: SKELETON_DEMO_AVATAR,
    },
    {
      name: 'card',
      description:
        'A loading `z-card`: the title and description bars are passed to `z-card-title`/`z-card-description` through their `zTitle`/`zDescription` template inputs, and an `aspect-video` bar fills `z-card-content` in place of media.',
      component: ZardDemoSkeletonCardComponent,
      codeData: SKELETON_DEMO_CARD,
    },
    {
      name: 'text',
      description:
        'A paragraph of body copy: three full-width lines, the last one narrower to mimic a line that does not reach the margin.',
      component: ZardDemoSkeletonTextComponent,
      codeData: SKELETON_DEMO_TEXT,
    },
    {
      name: 'form',
      description:
        'Two label-and-control pairs plus a submit action: each label bar sits above an `h-8` bar matching the height of `z-input`, and the trailing `h-8` bar matches a default `z-button`.',
      component: ZardDemoSkeletonFormComponent,
      codeData: SKELETON_DEMO_FORM,
    },
    {
      name: 'table',
      description:
        'A `z-table` body: five rows, each with a flexible primary-column bar and two fixed-width bars for secondary columns.',
      component: ZardDemoSkeletonTableComponent,
      codeData: SKELETON_DEMO_TABLE,
    },
  ],
};
