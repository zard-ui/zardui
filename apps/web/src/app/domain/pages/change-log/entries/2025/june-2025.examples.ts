import { ALERT_DIALOG_DEMO_PREVIEW } from '@generated/components/alert-dialog/demo/preview';
import { DIALOG_DEMO_PREVIEW } from '@generated/components/dialog/demo/preview';
import { DROPDOWN_DEMO_DEFAULT } from '@generated/components/dropdown/demo/default';
import { POPOVER_DEMO_PREVIEW } from '@generated/components/popover/demo/preview';
import { ALERT_DIALOG_CLI_ADD } from '@generated/installation/cli/add-alert-dialog';
import { DIALOG_CLI_ADD } from '@generated/installation/cli/add-dialog';
import { DROPDOWN_CLI_ADD } from '@generated/installation/cli/add-dropdown';
import { POPOVER_CLI_ADD } from '@generated/installation/cli/add-popover';

import { ZardDemoAlertDialogPreviewComponent } from '@zard/components/alert-dialog/demo/preview';
import { ZardDemoDialogPreviewComponent } from '@zard/components/dialog/demo/preview';
import { ZardDemoDropdownDefaultComponent } from '@zard/components/dropdown/demo/default';
import { ZardDemoPopoverPreviewComponent } from '@zard/components/popover/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const JUNE_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'preview',
    description:
      'Modal dialog component for displaying important content that requires user attention with backdrop overlay.',
    component: ZardDemoDialogPreviewComponent,
    componentName: 'dialog',
    codeData: DIALOG_DEMO_PREVIEW,
    cliAdd: DIALOG_CLI_ADD,
  },
  {
    name: 'preview',
    description: 'Floating content container that appears on trigger with customizable positioning and close behavior.',
    component: ZardDemoPopoverPreviewComponent,
    componentName: 'popover',
    codeData: POPOVER_DEMO_PREVIEW,
    cliAdd: POPOVER_CLI_ADD,
  },
  {
    name: 'preview',
    description:
      'Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.',
    component: ZardDemoAlertDialogPreviewComponent,
    componentName: 'alert-dialog',
    codeData: ALERT_DIALOG_DEMO_PREVIEW,
    cliAdd: ALERT_DIALOG_CLI_ADD,
  },
  {
    name: 'default',
    description: 'Context menu with hierarchical actions, keyboard navigation, and support for nested submenus.',
    component: ZardDemoDropdownDefaultComponent,
    componentName: 'dropdown',
    codeData: DROPDOWN_DEMO_DEFAULT,
    cliAdd: DROPDOWN_CLI_ADD,
  },
];
