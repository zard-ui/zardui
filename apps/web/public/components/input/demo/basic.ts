import { Component } from '@angular/core';

import { ZardInputComponent } from '../input.component';

@Component({
  standalone: true,
  imports: [ZardInputComponent],
  template: `
    <input z-input zSize="small" placeholder="small size" />
    <input z-input zSize="default" placeholder="default size" />
    <input z-input zSize="large" placeholder="large size" />
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
export class ZardDemoInputBasicComponent {}
