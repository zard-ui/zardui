import { Component } from '@angular/core';

import { ZardInputComponent } from '../input.component';

@Component({
  standalone: true,
  imports: [ZardInputComponent],
  template: `
    <input z-input zType="default" placeholder="Default" />
    <input z-input zType="primary" placeholder="Primary" />
    <input z-input zType="secondary" placeholder="Secondary" />
    <input z-input zType="destructive" placeholder="Destructive" />
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
export class ZardDemoInputBasicComponent {}
