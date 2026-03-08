import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-disabled',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Toggle disabled" disabled>
      <ng-icon name="bold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ bold: ZardIconRegistry.bold })],
})
export class ZardDemoToggleDisabledComponent {}
