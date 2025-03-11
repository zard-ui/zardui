import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zLoading>Default</button>
    <button z-button zLoading zType="destructive">Destructive</button>
    <button z-button zLoading zType="outline">Outline</button>
    <button z-button zLoading zType="secondary">Secondary</button>
    <button z-button zLoading zType="ghost">Ghost</button>
    <button z-button zLoading zType="link">Link</button>
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
export class ZardDemoButtonLoadingComponent {}
