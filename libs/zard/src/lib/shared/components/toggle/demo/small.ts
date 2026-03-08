import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '../../../core/icons-registry';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-small',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Toggle small" zSize="sm">
      <ng-icon name="bold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ bold: ZardIconRegistry.bold })],
})
export class ZardDemoToggleSmallComponent {}
