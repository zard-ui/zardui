```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core/icons-registry';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline">Button</button>
    <button type="button" z-button zType="outline"><ng-icon name="arrow-up" /></button>
    <button type="button" z-button zType="outline">
      Button
      <ng-icon name="popcorn" />
    </button>
  `,
  viewProviders: [provideIcons({ arrowUp: ZardIconRegistry['arrow-up'], popcorn: ZardIconRegistry.popcorn })],
})
export class ZardDemoButtonDefaultComponent {}

```