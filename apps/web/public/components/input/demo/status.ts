import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <input z-input placeholder="Default" />
    <input z-input zStatus="error" placeholder="Error" />
    <input z-input zStatus="warning" placeholder="Warning" />
    <input z-input zStatus="success" placeholder="Success" />
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
export class ZardDemoInputStatusComponent {}
