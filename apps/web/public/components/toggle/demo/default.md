```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardBoldIcon } from '../../../core/icons-registry';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-default',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Default toggle">
      <ng-icon name="bold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ bold: zardBoldIcon })],
})
export class ZardDemoToggleDefaultComponent {}

```