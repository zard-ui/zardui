import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-default',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeDefaultComponent {}
