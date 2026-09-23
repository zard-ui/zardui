import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';

interface Target {
  readonly label: string;
  readonly amount: string;
  readonly percent: number;
  readonly achieved: string;
}

@Component({
  selector: 'z-card-savings-targets',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardProgressComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Savings Targets" />
        <p
          z-card-description
          zDescription="Active milestones for 2024 across your portfolio. Monitor how close you are to each savings goal."
        ></p>
      </z-card-header>

      <z-card-content>
        <div z-item-group class="gap-3" role="list">
          @for (target of targets; track target.label) {
            <z-item role="listitem" zVariant="muted" class="flex-col items-stretch">
              <z-item-content class="gap-3">
                <p z-item-description class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {{ target.label }}
                </p>
                <span class="text-3xl font-semibold tabular-nums">{{ target.amount }}</span>
                <z-progress [value]="target.percent" [attr.aria-label]="target.label + ' progress'" />
              </z-item-content>
              <div z-item-footer>
                <span class="text-muted-foreground text-sm">{{ target.percent }}% achieved</span>
                <span class="text-sm font-medium tabular-nums">{{ target.achieved }}</span>
              </div>
            </z-item>
          }
        </div>
      </z-card-content>

      <z-card-content class="flex items-center">
        <p z-card-description class="text-center" zDescription="You have not met your targets for this year."></p>
      </z-card-content>
    </z-card>
  `,
})
export class CardSavingsTargetsComponent {
  readonly targets: readonly Target[] = [
    { label: 'Retirement', amount: '$420,000', percent: 65, achieved: '$273,000' },
    { label: 'Real Estate', amount: '$85,000', percent: 32, achieved: '$27,200' },
  ];
}
