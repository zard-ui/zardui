```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
      </div>
      <div class="flex w-full flex-wrap gap-2">
        <z-badge zType="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
          <span class="icon-badge-check"></span>
          Verified
        </z-badge>
        <z-badge zShape="pill" class="h-5 min-w-5 px-1 font-mono tabular-nums">8</z-badge>
        <z-badge zShape="pill" zType="destructive" class="h-5 min-w-5 px-1 font-mono tabular-nums">99</z-badge>
        <z-badge zShape="pill" zType="outline" class="h-5 min-w-5 px-1 font-mono tabular-nums">20+</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeDefaultComponent {}

```