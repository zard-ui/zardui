import { Component } from '@angular/core';

import { ALERT_DIALOG_DEMO_DEFAULT } from '@generated/components/alert-dialog/demo/default';
import { DIALOG_DEMO_BASIC } from '@generated/components/dialog/demo/basic';
import { DROPDOWN_DEMO_DEFAULT } from '@generated/components/dropdown/demo/default';
import { POPOVER_DEMO_DEFAULT } from '@generated/components/popover/demo/default';

import { ZardDemoAlertDialogDefaultComponent } from '@zard/components/alert-dialog/demo/default';
import { ZardDemoDialogBasicComponent } from '@zard/components/dialog/demo/basic';
import { ZardDropdownDemoComponent } from '@zard/components/dropdown/demo/default';
import { ZardDemoPopoverDefaultComponent } from '@zard/components/popover/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-june-2025',
  standalone: true,
  template: ``,
})
export class June2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'June 2025',
    year: 2025,
    monthNumber: 6,
    date: new Date(2025, 5, 1),
    id: '06-2025',
  };

  readonly overview =
    'Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'basic',
      description:
        'Modal dialog component for displaying important content that requires user attention with backdrop overlay.',
      component: ZardDemoDialogBasicComponent,
      componentName: 'dialog',
      codeData: DIALOG_DEMO_BASIC,
    },
    {
      name: 'default',
      description:
        'Floating content container that appears on trigger with customizable positioning and close behavior.',
      component: ZardDemoPopoverDefaultComponent,
      componentName: 'popover',
      codeData: POPOVER_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description:
        'Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.',
      component: ZardDemoAlertDialogDefaultComponent,
      componentName: 'alert-dialog',
      codeData: ALERT_DIALOG_DEMO_DEFAULT,
    },
    {
      name: 'default',
      description: 'Context menu with hierarchical actions, keyboard navigation, and support for nested submenus.',
      component: ZardDropdownDemoComponent,
      componentName: 'dropdown',
      codeData: DROPDOWN_DEMO_DEFAULT,
    },
  ];
}
