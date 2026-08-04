import { AVATAR_DEMO_BASIC } from '@generated/components/avatar/demo/basic';
import { BREADCRUMB_DEMO_DEFAULT } from '@generated/components/breadcrumb/demo/default';
import { SEPARATOR_DEMO_PREVIEW } from '@generated/components/separator/demo/preview';
import { AVATAR_CLI_ADD } from '@generated/installation/cli/add-avatar';
import { BREADCRUMB_CLI_ADD } from '@generated/installation/cli/add-breadcrumb';
import { SEPARATOR_CLI_ADD } from '@generated/installation/cli/add-separator';

import { ZardDemoAvatarBasicComponent } from '@zard/components/avatar/demo/basic';
import { ZardDemoBreadcrumbDefaultComponent } from '@zard/components/breadcrumb/demo/default';
import { ZardDemoSeparatorPreviewComponent } from '@zard/components/separator/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const AUGUST_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'basic',
    description: 'User profile image component with automatic fallback to initials and multiple size variants.',
    component: ZardDemoAvatarBasicComponent,
    componentName: 'avatar',
    codeData: AVATAR_DEMO_BASIC,
    cliAdd: AVATAR_CLI_ADD,
  },
  {
    name: 'preview',
    description:
      'Visual separator component for separating content sections with horizontal and vertical orientations.',
    component: ZardDemoSeparatorPreviewComponent,
    componentName: 'separator',
    codeData: SEPARATOR_DEMO_PREVIEW,
    cliAdd: SEPARATOR_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Navigation breadcrumb trail showing the current page location within a hierarchical structure.',
    component: ZardDemoBreadcrumbDefaultComponent,
    componentName: 'breadcrumb',
    codeData: BREADCRUMB_DEMO_DEFAULT,
    cliAdd: BREADCRUMB_CLI_ADD,
  },
];
