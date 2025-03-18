import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: ` <z-badge zSize="sm">Small</z-badge> `,
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
export class ZardDemoBadgeSizeComponent {}
