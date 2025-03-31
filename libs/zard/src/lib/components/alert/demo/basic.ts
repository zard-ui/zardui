import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert zIcon="icon-code-xml" zTitle="Hello World!" zDescription="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint." /> `,
})
export class ZardDemoAlertBasicComponent {}
