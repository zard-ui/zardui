```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <z-alert [zTitle]="title" [zDescription]="description" zType="success" zAppearance="outline" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="success" zAppearance="soft" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="success" zAppearance="fill" />
  `,
})
export class ZardDemoAlertSuccessComponent {
  title = 'Success alert!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```