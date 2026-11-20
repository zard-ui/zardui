import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';

@Component({
  selector: 'z-preview-01-index-investing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Dollar-Cost Averaging" />
        <z-card-description zDescription="A strategy for building wealth over time." />
      </z-card-header>
      <z-card-content>
        <z-card-description class="style-sera:mt-0 mt-3 text-sm leading-relaxed" [zDescription]="body" />
        <!-- prettier-ignore -->
        <ng-template #body>
          <a href="#" class="hover:text-primary underline underline-offset-4">Over time</a>, this smooths out the
          average cost of your investments. When prices drop, your fixed amount buys more shares. When prices rise, you
          buy fewer. The result is a lower average cost per share compared to lump-sum investing during volatile periods.
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01IndexInvestingComponent {}
