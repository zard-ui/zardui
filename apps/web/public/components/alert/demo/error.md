```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    <z-alert [zTitle]="title" [zDescription]="description" zType="error" zAppearance="outline" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="error" zAppearance="soft" />

    <z-alert [zTitle]="title" [zDescription]="description" zType="error" zAppearance="fill" />
  `,
})
export class ZardDemoAlertErrorComponent {
  title = 'Error alert!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}

```