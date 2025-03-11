import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zSize="sm">Small</button>
    <button z-button>Default</button>
    <button z-button zSize="lg">Large</button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoButtonSizeComponent {}
