import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap gap-2">
        <z-badge zType="success">Success</z-badge>
        <z-badge zType="warning">Warning</z-badge>
        <z-badge zType="error">Error</z-badge>
        <z-badge zType="info">Info</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeSemanticColorsComponent {}
