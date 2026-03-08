import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardIconRegistry } from '@/shared/core';

@Component({
  selector: 'z-demo-button-group-input',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardInputDirective],
  template: `
    <z-button-group>
      <input z-input placeholder="Search..." />
      <button type="button" z-button zType="outline"><ng-icon name="search" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ search: ZardIconRegistry.search })],
})
export class ZardDemoButtonGroupInputComponent {}
