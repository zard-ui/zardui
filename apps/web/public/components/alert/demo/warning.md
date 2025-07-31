```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <z-alert [zTitle]="title" [zDescription]="description" zType="warning" zAppearance="outline" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="warning" zAppearance="soft" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="warning" zAppearance="fill" />
  `,
})
export class ZardDemoAlertWarningComponent {
  title = 'Warning alert!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```