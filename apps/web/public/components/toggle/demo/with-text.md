```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardItalicIcon } from '../../../core/icons-registry';
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
  viewProviders: [provideIcons({ italic: zardItalicIcon })],
})
export class ZardDemoToggleWithTextComponent {}

```