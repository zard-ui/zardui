import { ALERT_DIALOG_DEMO_DEFAULT } from '@generated/components/alert-dialog/demo/default';
import { DIALOG_DEMO_BASIC } from '@generated/components/dialog/demo/basic';
import { DROPDOWN_DEMO_DEFAULT } from '@generated/components/dropdown/demo/default';
import { POPOVER_DEMO_PREVIEW } from '@generated/components/popover/demo/preview';
import { ALERT_DIALOG_CLI_ADD } from '@generated/installation/cli/add-alert-dialog';
import { DIALOG_CLI_ADD } from '@generated/installation/cli/add-dialog';
import { DROPDOWN_CLI_ADD } from '@generated/installation/cli/add-dropdown';
import { POPOVER_CLI_ADD } from '@generated/installation/cli/add-popover';

import { ZardDemoAlertDialogDefaultComponent } from '@zard/components/alert-dialog/demo/default';
import { ZardDemoDialogBasicComponent } from '@zard/components/dialog/demo/basic';
import { ZardDemoDropdownDefaultComponent } from '@zard/components/dropdown/demo/default';
import { ZardDemoPopoverPreviewComponent } from '@zard/components/popover/demo/preview';

import { type ChangelogExample } from '../changelog-entry.interface';

export const JUNE_2025_EXAMPLES: ChangelogExample[] = [
  {
    name: 'basic',
    description:
      'Modal dialog component for displaying important content that requires user attention with backdrop overlay.',
    component: ZardDemoDialogBasicComponent,
    componentName: 'dialog',
    codeData: DIALOG_DEMO_BASIC,
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
    name: 'default',
    description:
      'Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.',
    component: ZardDemoAlertDialogDefaultComponent,
    componentName: 'alert-dialog',
    codeData: ALERT_DIALOG_DEMO_DEFAULT,
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
