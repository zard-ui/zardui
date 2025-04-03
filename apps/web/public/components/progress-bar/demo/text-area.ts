import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <textarea z-input rows="6" cols="12" placeholder="Default"></textarea>
    <textarea zBorderless z-input rows="6" cols="12" placeholder="Default"></textarea>
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
export class ZardDemoInputTextAreaComponent {}
