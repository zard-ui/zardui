import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';
import type { IconName } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert [zIcon]="icon" [zTitle]="title" [zDescription]="description" /> `,
})
export class ZardDemoAlertBasicComponent {
  icon: IconName = 'CodeXml';
  title = 'Hello World!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}
