import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip.module';

@Component({
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTooltipModule],
  template: `
    <button z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button>
    <button z-button zType="outline" zTooltip="Tooltip content">Hover</button>
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
export class ZardDemoTooltipBasicComponent {}
