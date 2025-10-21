```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { Italic } from 'lucide-angular';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle>
      <z-icon [zType]="ItalicIcon" />
      Italic
    </z-toggle>
  `,
})
export class ZardDemoToggleWithTextComponent {
  readonly ItalicIcon = Italic;
}

```