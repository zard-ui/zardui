import { Component } from '@angular/core';

import { ZardInputComponent } from '../input.component';

@Component({
  standalone: true,
  imports: [ZardInputComponent],
  template: `
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
