import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-preview',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-wrap items-center gap-2">
      <z-badge>Badge</z-badge>
      <z-badge zType="secondary">Secondary</z-badge>
      <z-badge zType="destructive">Destructive</z-badge>
      <z-badge zType="outline">Outline</z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBadgePreviewComponent {}
