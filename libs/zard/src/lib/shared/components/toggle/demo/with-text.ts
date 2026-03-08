import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-text',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle>
      <ng-icon name="italic" />
      Italic
    </z-toggle>
  `,
  viewProviders: [provideIcons({ italic: ZardIconRegistry.italic })],
})
export class ZardDemoToggleWithTextComponent {}
