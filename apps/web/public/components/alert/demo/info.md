```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <z-alert [zTitle]="title" [zDescription]="description" zType="info" zAppearance="outline" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="info" zAppearance="soft" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="info" zAppearance="fill" />
  `,
})
export class ZardDemoAlertInfoComponent {
  title = 'Info alert!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```