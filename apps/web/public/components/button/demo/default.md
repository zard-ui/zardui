```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePopcorn } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline">Button</button>
    <button type="button" z-button zType="outline"><ng-icon name="lucideArrowUp" /></button>
    <button type="button" z-button zType="outline">
      Button
      <ng-icon name="lucidePopcorn" />
    </button>
  `,
  viewProviders: [provideIcons({ lucideArrowUp, lucidePopcorn })],
})
export class ZardDemoButtonDefaultComponent {}

```