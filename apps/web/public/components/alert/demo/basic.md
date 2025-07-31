```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert [zIcon]="icon" [zTitle]="title" [zDescription]="description" /> `,
})
export class ZardDemoAlertBasicComponent {
  icon = 'icon-code-xml';
  title = 'Hello World!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```