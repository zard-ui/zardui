import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-custom-colors',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</z-badge>
        <z-badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</z-badge>
        <z-badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</z-badge>
        <z-badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</z-badge>
        <z-badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeCustomColorsComponent {}
