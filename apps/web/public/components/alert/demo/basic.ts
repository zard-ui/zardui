import { Component } from '@angular/core';

import { ZardAlertModule } from '../alert.module';

@Component({
  standalone: true,
  imports: [ZardAlertModule],
  template: `
    <z-alert>
      <z-alert-icon class="icon-code-xml" zSize="lg" />
      <z-alert-title>Hello World!</z-alert-title>
      <z-alert-description>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.</z-alert-description>
    </z-alert>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoAlertBasicComponent {}
