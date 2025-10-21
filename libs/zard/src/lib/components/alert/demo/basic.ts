import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';
import { CodeXml } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert [zIcon]="icon" [zTitle]="title" [zDescription]="description" /> `,
})
export class ZardDemoAlertBasicComponent {
  icon = CodeXml;
  title = 'Hello World!';
  description = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.';
}
