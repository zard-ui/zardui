```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-text',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle>
      <ng-icon name="lucideItalic" />
      Italic
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideItalic })],
})
export class ZardDemoToggleWithTextComponent {}

```