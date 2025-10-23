```angular-ts showLineNumbers copyButton
import { ZardIcon } from '@zard/components/icon/icons';
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert [zIcon]="icon" [zTitle]="title" [zDescription]="description" /> `,
})
export class ZardDemoAlertBasicComponent {
  icon = 'code-xml' as ZardIcon;
  title = 'Hello World!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```