import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zFull>Default</button>
    <button z-button zFull zType="destructive">Destructive</button>
    <button z-button zFull zType="outline">Outline</button>
    <button z-button zFull zType="secondary">Secondary</button>
    <button z-button zFull zType="ghost">Ghost</button>
    <button z-button zFull zType="link">Link</button>
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
export class ZardDemoButtonFullComponent {}
