```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <z-alert [zTitle]="title" [zDescription]="description" zAppearance="outline" />

    <z-alert [zTitle]="title" [zDescription]="description" zAppearance="soft" />

    <z-alert [zTitle]="title" [zDescription]="description" zAppearance="fill" />
  `,
})
export class ZardDemoAlertDefaultComponent {
  title = 'Default alert!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```