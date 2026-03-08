import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '../../../core/icons-registry';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-outline',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <ng-icon name="bold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ bold: ZardIconRegistry.bold })],
})
export class ZardDemoToggleOutlineComponent {}
