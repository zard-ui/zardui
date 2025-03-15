import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: `
    <z-badge>Default</z-badge>
    <z-badge zType="secondary">Secondary</z-badge>
    <z-badge zType="destructive">Destructive</z-badge>
    <z-badge zType="outline">Outline</z-badge>
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
export class ZardDemoBadgeBasicComponent {}
