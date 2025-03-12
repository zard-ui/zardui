import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button>Default</button>
    <button z-button zType="destructive">Destructive</button>
    <button z-button zType="outline">Outline</button>
    <button z-button zType="secondary">Secondary</button>
    <button z-button zType="ghost">Ghost</button>
    <button z-button zType="link">Link</button>
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
export class ZardDemoButtonBasicComponent {}
