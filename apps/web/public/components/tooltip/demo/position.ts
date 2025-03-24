import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip.module';

@Component({
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTooltipModule],
  template: `
    <button z-button zType="outline" zTooltip="Tooltip content" zPosition="left">Left</button>
    <button z-button zType="outline" zTooltip="Tooltip content" zPosition="top">Top</button>
    <button z-button zType="outline" zTooltip="Tooltip content" zPosition="right">Right</button>
    <button z-button zType="outline" zTooltip="Tooltip content" zPosition="bottom">Bottom</button>
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
export class ZardDemoTooltipPositionComponent {}
