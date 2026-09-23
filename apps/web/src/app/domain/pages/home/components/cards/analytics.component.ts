import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

@Component({
  selector: 'z-card-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBadgeComponent, ZardButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-sm pb-0!">
      <z-card-header>
        <z-card-title zTitle="Analytics" />
        <ng-template #visitors>
          418.2K Visitors
          <z-badge>+10%</z-badge>
        </ng-template>
        <p z-card-description class="flex items-center gap-1" [zDescription]="visitors"></p>
        <div z-card-action>
          <button type="button" z-button zType="outline" zSize="sm">View Analytics</button>
        </div>
      </z-card-header>

      <svg
        viewBox="0 0 100 86"
        preserveAspectRatio="none"
        class="text-chart-1 aspect-[1/0.35] w-full"
        role="img"
        aria-label="Visitor trend"
      >
        <path [attr.d]="areaPath" fill="currentColor" opacity="0.28" />
        <path
          [attr.d]="strokePath"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </z-card>
  `,
})
export class CardAnalyticsComponent {
  readonly areaPath = 'M0 52L18 40L36 46L54 70L72 50L100 49V86H0Z';
  readonly strokePath = 'M0 52L18 40L36 46L54 70L72 50L100 49';
}
